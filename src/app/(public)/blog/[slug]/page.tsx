import { ArrowRight, ChevronRight, Heart, Mail } from "lucide-react";
import Link from "next/link";

import BlogDetailContent from "@/components/public/sections/blog/blog-detail-content";
import BlogDetailHero from "@/components/public/sections/blog/blog-detail-hero";
import BlogDetailRelated from "@/components/public/sections/blog/blog-detail-related";
import CallToAction from "@/components/public/sections/call-to-action";

// Dummy blog data - in real app, this would come from API/database
const blogData = {
  "5-small-daily-habits-transform-mental-health": {
    title: "5 Small Daily Habits That Transform Your Mental Health",
    description:
      "Discover how simple micro-actions—like mindful breathing or gratitude journaling—can make a powerful impact on your mental wellbeing. Uncover practical tips designed for everyday life to help you enhance focus, resilience, and happiness.",
    category: "Mind Wellness",
    readTime: "5 min read",
    date: "FEB 15, 2024",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    imageAlt: "Mental health and wellness",
    slug: "5-small-daily-habits-transform-mental-health",
    content: `
      <h2>The Power of Micro-Habits</h2>
      <p>When it comes to mental health, we often think we need to make massive changes to see results. However, research consistently shows that small, consistent actions can have profound impacts on our mental wellbeing.</p>
      
      <h3>1. Morning Gratitude Practice</h3>
      <p>Starting your day with gratitude isn't just a feel-good practice—it's scientifically proven to rewire your brain for positivity. Studies show that people who practice gratitude regularly experience:</p>
      <ul>
        <li>25% increase in happiness levels</li>
        <li>Better sleep quality</li>
        <li>Reduced symptoms of depression and anxiety</li>
        <li>Stronger immune system</li>
      </ul>
      
      <h3>2. Mindful Breathing Breaks</h3>
      <p>Taking just 2-3 minutes throughout your day to focus on your breath can significantly reduce stress and improve focus. The 4-7-8 breathing technique is particularly effective:</p>
      <ol>
        <li>Inhale for 4 counts</li>
        <li>Hold for 7 counts</li>
        <li>Exhale for 8 counts</li>
      </ol>
      
      <h3>3. Digital Sunset</h3>
      <p>Creating a "digital sunset" by putting away devices 1 hour before bed can improve sleep quality by up to 40%. The blue light from screens disrupts melatonin production, making it harder to fall asleep.</p>
      
      <h3>4. Micro-Movement</h3>
      <p>Even 5 minutes of gentle movement can boost endorphins and improve mood. Try:</p>
      <ul>
        <li>Stretching at your desk</li>
        <li>Walking around the block</li>
        <li>Dancing to one song</li>
        <li>Simple yoga poses</li>
      </ul>
      
      <h3>5. Evening Reflection</h3>
      <p>Taking 5 minutes before bed to reflect on your day helps process emotions and promotes better sleep. Ask yourself:</p>
      <ul>
        <li>What went well today?</li>
        <li>What am I grateful for?</li>
        <li>What would I like to improve tomorrow?</li>
      </ul>
      
      <h2>Making It Stick</h2>
      <p>The key to success with these micro-habits is consistency, not perfection. Start with just one habit and gradually add others. Remember, even 1% improvement daily leads to 37x better results over a year.</p>
      
      <blockquote>
        "The journey of a thousand miles begins with a single step. Your mental health journey starts with one small, consistent action today."
      </blockquote>
    `,
    relatedPosts: [
      {
        title: "Building Resilience: Mental Health Strategies for Tough Times",
        description:
          "Learn evidence-based techniques to build emotional resilience and navigate life's challenges with grace.",
        category: "Mental Health",
        readTime: "8 min read",
        date: "JAN 28, 2024",
        image:
          "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        imageAlt: "Mental resilience and wellness",
        slug: "building-resilience-mental-health-strategies",
      },
      {
        title: "The Complete Guide to Stress Management",
        description:
          "Master the art of stress management with proven techniques from mindfulness to physical exercise.",
        category: "Stress Management",
        readTime: "9 min read",
        date: "JAN 20, 2024",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        imageAlt: "Stress management and wellness",
        slug: "complete-guide-stress-management",
      },
    ],
  },
};

interface BlogDetailPageProperties {
  params: {
    slug: string;
  };
}

export default function BlogDetailPage({ params }: BlogDetailPageProperties) {
  const post = blogData[params.slug as keyof typeof blogData];

  return (
    <div className="min-h-screen">
      <BlogDetailHero post={post} />

      <BlogDetailContent content={post.content} />

      <BlogDetailRelated posts={post.relatedPosts} />

      <CallToAction
        title="Ready to Start Your Wellness Journey?"
        description="Join thousands of people who have transformed their lives with our personalized wellness programs. Your journey to optimal health starts here."
        actions={
          <>
            <Link
              href="#programs"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-[#35bec5] transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Heart className="mr-2 h-5 w-5" />
              <span className="relative z-10">Explore Programs</span>
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-white hover:text-[#35bec5] hover:shadow-lg"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <Mail className="mr-2 h-5 w-5" />
              <span> Get Free Consultation</span>
              <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </>
        }
      />
    </div>
  );
}
