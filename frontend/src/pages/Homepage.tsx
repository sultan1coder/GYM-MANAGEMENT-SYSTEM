import { Link } from "react-router-dom";
import {
  Dumbbell,
  Users,
  Clock,
  Shield,
  Award,
  Star,
  ChevronRight,
  Play,
} from "lucide-react";

const Homepage = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fitness Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              State-of-the-art equipment, expert trainers, and a community that
              motivates you to reach your goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/members/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                Start Your Journey
                <ChevronRight className="h-5 w-5" />
              </Link>
              <button className="px-8 py-4 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                <Play className="h-5 w-5" />
                Watch Tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              Why Choose BILKHAYR GYM?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We provide everything you need for a complete fitness experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Dumbbell className="h-8 w-8" />,
                title: "Premium Equipment",
                description:
                  "Latest cardio and strength training equipment from top brands",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Expert Trainers",
                description:
                  "Certified personal trainers to guide your fitness journey",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "24/7 Access",
                description:
                  "Work out on your schedule with round-the-clock gym access",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Safe Environment",
                description:
                  "Clean, sanitized, and secure facility for your peace of mind",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { number: "5000+", label: "Happy Members" },
              { number: "15+", label: "Expert Trainers" },
              { number: "100+", label: "Equipment Pieces" },
              { number: "24/7", label: "Access Hours" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold">
                  {stat.number}
                </div>
                <div className="text-xl text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
              What Our Members Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Real stories from real people
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Fitness Enthusiast",
                content:
                  "The trainers here are amazing! They helped me achieve my fitness goals faster than I ever thought possible.",
                rating: 5,
              },
              {
                name: "Mike Chen",
                role: "Bodybuilder",
                content:
                  "Best gym equipment in the city. The facility is always clean and well-maintained.",
                rating: 5,
              },
              {
                name: "Emma Davis",
                role: "Yoga Instructor",
                content:
                  "Great community and atmosphere. I love the variety of classes and equipment available.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <div className="space-y-6">
              <Award className="h-16 w-16 mx-auto" />
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of members who have transformed their lives at
                BILKHAYR GYM
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/members/register"
                  className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-all font-semibold"
                >
                  Become a Member
                </Link>
                <Link
                  to="/auth/login"
                  className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all"
                >
                  Staff Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
