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
  Camera,
  Heart,
  Target,
  Zap,
} from "lucide-react";

const Homepage = () => {
  return (
    <div className="space-y-20">
      {/* Hero Section with Background Image */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjR8fGJvZHlidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D')`,
            filter: "brightness(0.7)",
          }}
        ></div>
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-8 text-center">
            <h1 className="text-5xl font-bold text-white md:text-7xl drop-shadow-lg">
              Transform Your
              <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                Fitness Journey
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-xl text-white md:text-2xl drop-shadow-lg">
              State-of-the-art equipment, expert trainers, and a community that
              motivates you to reach your goals.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/members/register"
                className="flex items-center justify-center gap-2 px-8 py-4 text-white transition-all transform shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:scale-105"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5" />
              </Link>
              <button className="flex items-center justify-center gap-2 px-8 py-4 text-white transition-all border-2 border-white rounded-xl hover:bg-white hover:text-blue-600">
                <Play className="w-5 h-5" />
                Watch Tour
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Fitness Gallery Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
              Experience Our World-Class Facility
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-300">
              Take a virtual tour of our state-of-the-art gym and see what makes
              us different
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Cardio Zone */}
            <div className="relative overflow-hidden transition-all duration-500 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <img
                src="https://images.unsplash.com/photo-1639496908204-6f949b0f46e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNhcmRpbyUyMHpvbmUlMjBleGVyY2lzZXxlbnwwfHwwfHx8MA%3D%3D"
                alt="Cardio Zone"
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Cardio Zone</h3>
                <p className="text-blue-200">
                  Latest treadmills, ellipticals, and rowing machines
                </p>
              </div>
            </div>

            {/* Strength Training */}
            <div className="relative overflow-hidden transition-all duration-500 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <img
                src="https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGJvZHlidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Strength Training"
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Strength Training</h3>
                <p className="text-blue-200">
                  Comprehensive free weights and machines
                </p>
              </div>
            </div>

            {/* Functional Training */}
            <div className="relative overflow-hidden transition-all duration-500 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <img
                src="https://images.unsplash.com/photo-1632781297772-1d68f375d878?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJvZHlidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Functional Training"
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Functional Training</h3>
                <p className="text-blue-200">
                  TRX, kettlebells, and mobility equipment
                </p>
              </div>
            </div>

            {/* Yoga & Stretching */}
            <div className="relative overflow-hidden transition-all duration-500 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <img
                src="https://images.unsplash.com/photo-1549995546-87cb41aa98a4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHlvZ2ElMjBhbmQlMjBzdHJldGNoaW5nJTIwZXhlcmNpc2V8ZW58MHx8MHx8fDA%3D"
                alt="Yoga & Stretching"
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Yoga & Stretching</h3>
                <p className="text-blue-200">
                  Dedicated space for flexibility and recovery
                </p>
              </div>
            </div>

            {/* Group Classes */}
            <div className="relative overflow-hidden transition-all duration-500 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <img
                src="https://images.unsplash.com/photo-1723117417879-2effcca63cda?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fGdyb3VwJTIwY2xhc3NlcyUyMGV4ZXJjaXNlJTIwaW4lMjBneW18ZW58MHx8MHx8fDA%3D"
                alt="Group Classes"
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Group Classes</h3>
                <p className="text-blue-200">
                  High-energy group fitness sessions
                </p>
              </div>
            </div>

            {/* Recovery Zone */}
            <div className="relative overflow-hidden transition-all duration-500 shadow-lg group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
              <img
                src="https://images.unsplash.com/photo-1669323149885-6bda5714e85b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGJvZHlidWlsZGluZ3xlbnwwfHwwfHx8MA%3D%3D"
                alt="Recovery Zone"
                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="mb-2 text-2xl font-bold">Recovery Zone</h3>
                <p className="text-blue-200">
                  Sauna, massage chairs, and stretching areas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
              Why Choose BILKHAYR GYM?
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-slate-600 dark:text-slate-300">
              We provide everything you need for a complete fitness experience
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Dumbbell className="w-8 h-8" />,
                title: "Premium Equipment",
                description:
                  "Latest cardio and strength training equipment from top brands",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Expert Trainers",
                description:
                  "Certified personal trainers to guide your fitness journey",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "24/7 Access",
                description:
                  "Work out on your schedule with round-the-clock gym access",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Safe Environment",
                description:
                  "Clean, sanitized, and secure facility for your peace of mind",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 transition-all bg-white shadow-lg group dark:bg-slate-800 rounded-2xl hover:shadow-xl hover:-translate-y-1"
              >
                <div className="p-3 mb-4 text-white transition-transform bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl w-fit group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">
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

      {/* Stats Section with Background Image */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1641785041080-54b0413a2aa9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI4fHxib2R5YnVpbGRpbmclMjBjYXJkaW98ZW58MHx8MHx8fDA%3D')`,
            filter: "brightness(0.3)",
          }}
        ></div>
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 text-center text-white md:grid-cols-4">
            {[
              { number: "5000+", label: "Happy Members" },
              { number: "15+", label: "Expert Trainers" },
              { number: "100+", label: "Equipment Pieces" },
              { number: "24/7", label: "Access Hours" },
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl font-bold md:text-5xl">
                  {stat.number}
                </div>
                <div className="text-xl text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fitness Motivation Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
                Your Fitness Journey Starts Here
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300">
                Join a community of fitness enthusiasts who are committed to
                helping you achieve your goals. Our expert trainers and
                state-of-the-art facilities provide the perfect environment for
                your transformation.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Health First
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Goal Oriented
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    High Energy
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-green-500" />
                  <span className="text-slate-700 dark:text-slate-300">
                    Community
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Fitness Motivation"
                className="shadow-2xl rounded-2xl"
              />
              <div className="absolute p-4 bg-white shadow-lg -bottom-6 -left-6 dark:bg-slate-800 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">5000+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Active Members
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 space-y-4 text-center">
            <h2 className="text-4xl font-bold md:text-5xl text-slate-900 dark:text-white">
              What Our Members Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              Real stories from real people
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "David Johnson",
                role: "Fitness Enthusiast",
                content:
                  "The trainers here are amazing! They helped me achieve my fitness goals faster than I ever thought possible.",
                rating: 5,
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
              },
              {
                name: "Mike Chen",
                role: "Bodybuilder",
                content:
                  "Best gym equipment in the city. The facility is always clean and well-maintained.",
                rating: 5,
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
              },
              {
                name: "Alex Davis",
                role: "Yoga Instructor",
                content:
                  "Great community and atmosphere. I love the variety of classes and equipment available.",
                rating: 5,
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 transition-all bg-white shadow-lg dark:bg-slate-800 rounded-2xl hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="object-cover w-16 h-16 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="italic text-slate-600 dark:text-slate-300">
                  "{testimonial.content}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <div className="p-12 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl">
            <div className="space-y-6">
              <Award className="w-16 h-16 mx-auto" />
              <h2 className="text-4xl font-bold md:text-5xl">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of members who have transformed their lives at
                BILKHAYR GYM
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/members/register"
                  className="px-8 py-4 font-semibold text-blue-600 transition-all bg-white rounded-xl hover:bg-gray-100"
                >
                  Become a Member
                </Link>
                <Link
                  to="/auth/login"
                  className="px-8 py-4 text-white transition-all border-2 border-white rounded-xl hover:bg-white hover:text-blue-600"
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
