
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath } = await req.json();
    
    if (!filePath) {
      return new Response(
        JSON.stringify({ error: 'No file path provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Download the file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('bill_uploads')
      .download(filePath);
    
    if (downloadError) {
      console.error('Error downloading file:', downloadError);
      return new Response(
        JSON.stringify({ error: 'Failed to download file', details: downloadError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Convert PDF to base64
    const fileBuffer = await fileData.arrayBuffer();
    const base64File = btoa(String.fromCharCode(...new Uint8Array(fileBuffer)));

    // Process with Claude
    const extractionPrompt = `
      You are an expert at analyzing electricity bills. I'm going to provide you with an electricity bill in PDF format.
      Extract the following information from the bill:
      1. Customer name
      2. Bill month/period
      3. Contract demand/Sanctioned load
      4. Current bill amount
      5. Load factor
      6. Power factor
      7. Max demand recorded
      8. TOD consumption details
      9. Penalties or charges (if any)
      10. Rebates or discounts (if any)

      Return the extracted information in JSON format with these exact keys:
      {
        "customerName": "",
        "billMonth": "",
        "contractDemand": 0,
        "billAmount": 0,
        "loadFactor": 0,
        "powerFactor": 0,
        "maxDemand": 0,
        "todConsumption": {
          "peakHours": 0,
          "offPeakHours": 0
        },
        "penalties": [],
        "rebates": []
      }
    `;

    // Call Claude to extract info from the bill
    const extractionResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: extractionPrompt },
              { 
                type: 'image', 
                source: {
                  type: 'base64',
                  media_type: 'application/pdf',
                  data: base64File
                }
              }
            ]
          }
        ]
      })
    });

    const extractionData = await extractionResponse.json();
    
    if (!extractionResponse.ok) {
      console.error('Claude API error:', extractionData);
      return new Response(
        JSON.stringify({ error: 'Failed to extract data from bill', details: extractionData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Extract the JSON from Claude's response
    const extractedText = extractionData.content[0].text;
    // Parse the JSON from Claude's response (it may be embedded in markdown)
    const jsonMatch = extractedText.match(/```json\n([\s\S]*?)\n```/) || 
                      extractedText.match(/```\n([\s\S]*?)\n```/) ||
                      extractedText.match(/{[\s\S]*?}/);
                      
    let extractedInfo;
    if (jsonMatch) {
      try {
        extractedInfo = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (e) {
        console.error('Error parsing JSON from Claude:', e);
        extractedInfo = { error: 'Failed to parse JSON from Claude response' };
      }
    } else {
      extractedInfo = { error: 'No JSON found in Claude response' };
    }

    // Analyze the bill with a second prompt
    const analysisPrompt = `
      You are an expert in electricity bill optimization. Based on the following electricity bill data, provide optimization recommendations.
      
      ${JSON.stringify(extractedInfo, null, 2)}
      
      Analyze this data and provide:
      1. Optimal contract demand based on actual usage
      2. Potential savings from contract demand optimization
      3. Recommendations for TOD usage optimization
      4. Recommendations to avoid penalties
      5. Recommendations to maximize rebates
      
      Return your analysis in this exact JSON format:
      {
        "customerName": "",
        "billMonth": "",
        "currentDemand": 0,
        "currentBill": 0,
        "optimizedDemand": 0,
        "optimizedBill": 0,
        "savingsPerYear": 0,
        "recommendations": {
          "loadManagement": {
            "loadFactor": { "current": 0, "target": 0 },
            "powerFactor": { "current": 0, "status": "" },
            "billedDemand": { "current": 0, "max": 0 }
          },
          "todOptimization": {
            "peakHourSavings": 0,
            "isHigher": true
          },
          "penalties": {
            "delayedPayment": 0,
            "promptDiscount": 0,
            "arrearsStatus": ""
          }
        }
      }
    `;

    const analysisResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: analysisPrompt
          }
        ]
      })
    });

    const analysisData = await analysisResponse.json();
    
    if (!analysisResponse.ok) {
      console.error('Claude API error:', analysisData);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze bill data', details: analysisData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Extract the JSON from Claude's response
    const analysisText = analysisData.content[0].text;
    // Parse the JSON from Claude's response (it may be embedded in markdown)
    const analysisJsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                             analysisText.match(/```\n([\s\S]*?)\n```/) ||
                             analysisText.match(/{[\s\S]*?}/);
                      
    let analysisResult;
    if (analysisJsonMatch) {
      try {
        analysisResult = JSON.parse(analysisJsonMatch[1] || analysisJsonMatch[0]);
      } catch (e) {
        console.error('Error parsing JSON from Claude:', e);
        analysisResult = { error: 'Failed to parse JSON from Claude response' };
      }
    } else {
      analysisResult = { error: 'No JSON found in Claude response' };
    }

    return new Response(
      JSON.stringify({ 
        extraction: extractedInfo,
        analysis: analysisResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in analyze-bill function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
