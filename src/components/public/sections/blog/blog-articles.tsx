import BlogCard from "@/components/public/shared/blog-card";
import Pagination from "@/components/public/shared/pagination";

// Dummy blog data
const blogPosts = [
  {
    title: "5 Small Daily Habits That Transform Your Mental Health",
    description: "Discover how simple micro-actions—like mindful breathing or gratitude journaling—can make a powerful impact on your mental wellbeing. Uncover practical tips designed for everyday life to help you enhance focus, resilience, and happiness.",
    category: "Mindfulness",
    readTime: "5 min read",
    date: "FEB 15, 2024",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Mental health and wellness",
    slug: "5-small-daily-habits-transform-mental-health",
    tags: ["Mental Health", "Daily Habits", "Wellness"],
  },
  {
    title: "How to Eat Mindfully: A Doctor's Approach to Nutrition",
    description: "Explore how awareness and intention at the table lead to better nutrition and improved mood. Learn real strategies from physicians to cultivate mindful eating, prevent overeating, and savor every meal.",
    category: "Nutrition",
    readTime: "7 min read",
    date: "FEB 10, 2024",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Mindful eating and nutrition",
    slug: "how-to-eat-mindfully-doctors-approach-nutrition",
    tags: ["Nutrition", "Mindful Eating", "Health"],
  },
  {
    title: "The Science of Sleep: Why 8 Hours Isn't Always Enough",
    description: "Dive deep into sleep science and discover why quality matters more than quantity. Learn about sleep cycles, optimal bedtime routines, and how to create the perfect sleep environment for restorative rest.",
    category: "Wellness",
    readTime: "6 min read",
    date: "FEB 5, 2024",
    image: "https://images.unsplash.com/photo-1688383454417-b11a123846e9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHNsZWVwJTIwd2VsbG5lc3N8ZW58MHx8MHx8fDI%3D&auto=format&fit=crop&q=60&w=500",
    imageAlt: "Sleep and wellness",
    slug: "science-of-sleep-8-hours-not-enough",
    tags: ["Sleep", "Science", "Health"],
  },
  {
    title: "Building Resilience: Mental Health Strategies for Tough Times",
    description: "Learn evidence-based techniques to build emotional resilience and navigate life's challenges with grace. Discover how to develop a growth mindset and maintain mental wellness during difficult periods.",
    category: "Mindfulness",
    readTime: "8 min read",
    date: "JAN 28, 2024",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Mental resilience and wellness",
    slug: "building-resilience-mental-health-strategies",
    tags: ["Resilience", "Mental Health", "Strategies"],
  },
  {
    title: "The Complete Guide to Stress Management",
    description: "Master the art of stress management with proven techniques from mindfulness to physical exercise. Learn to identify stress triggers and develop healthy coping mechanisms for long-term wellness.",
    category: "Lifestyle",
    readTime: "9 min read",
    date: "JAN 20, 2024",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Stress management and wellness",
    slug: "complete-guide-stress-management",
    tags: ["Stress", "Management", "Wellness"],
  },
  {
    title: "Nutrition for Mental Health: Foods That Boost Your Mood",
    description: "Discover the powerful connection between nutrition and mental health. Learn which foods support brain function, improve mood, and contribute to overall emotional wellbeing.",
    category: "Nutrition",
    readTime: "6 min read",
    date: "JAN 15, 2024",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Nutrition for mental health",
    slug: "nutrition-mental-health-foods-boost-mood",
    tags: ["Nutrition", "Mental Health", "Food"],
  },
];

const categories = ["All", "Wellness", "Nutrition", "Mindfulness", "Lifestyle"];

export default function BlogArticles() {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12 space-y-6 text-center">
          <h2
            className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Latest{" "}
            <span
              className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Articles
            </span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Stay updated with our latest expert insights on wellness, nutrition, mindfulness, and
            healthy living. Get practical tips and inspiring stories to help you thrive on your
            wellness journey.
          </p>
        </div>

        {/* Category Filters */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category}
              className={`rounded-full px-6 py-3 text-sm font-medium transition-all duration-300 ${
                category === "All"
                  ? "bg-brand-gradient text-white shadow-lg"
                  : "bg-slate-100 text-slate-700 hover:bg-gradient-to-r hover:from-[#35bec5] hover:to-[#0c96c4] hover:text-white hover:shadow-lg"
              }`}
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Cards Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {blogPosts.map((post, index) => (
            <BlogCard key={index} blog={post} index={index} />
          ))}
        </div>
      </div>

      <Pagination currentPage={1} totalPages={10} />
    </section>
  );
}
