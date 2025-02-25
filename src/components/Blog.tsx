
import { Card } from "@/components/ui/card";

export const Blog = () => {
  const posts = [
    {
      title: "Understanding Your Electricity Bill",
      excerpt: "Learn how to read and interpret your electricity bill components...",
      date: "March 15, 2024",
      readTime: "5 min read"
    },
    {
      title: "Top Energy Saving Tips for Businesses",
      excerpt: "Discover practical ways to reduce your business energy consumption...",
      date: "March 10, 2024",
      readTime: "4 min read"
    },
    {
      title: "The Impact of Power Factor on Your Bill",
      excerpt: "Understanding how power factor affects your electricity charges...",
      date: "March 5, 2024",
      readTime: "6 min read"
    }
  ];

  return (
    <section className="py-16 bg-gray-50" id="blog">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Latest Articles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
