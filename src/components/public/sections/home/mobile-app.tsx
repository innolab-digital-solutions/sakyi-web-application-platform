import { Award, CheckCircle, Heart, Smartphone, Target,TrendingUp } from "lucide-react";
import Link from "next/link";

export default function MobileApp() {
  return (
    <section id="app" className="relative overflow-hidden bg-slate-50 py-24">
    {/* Background Elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/3 -right-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#35bec5]/5 to-[#0c96c4]/5 blur-3xl"></div>
      <div className="absolute bottom-1/3 -left-32 h-64 w-64 rounded-full bg-gradient-to-br from-[#4bc4db]/5 to-[#35bec5]/5 blur-3xl"></div>
    </div>

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left Column - Text Content */}
        <div className="space-y-8" data-aos="fade-right">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 px-4 py-2">
              <Smartphone className="h-4 w-4 text-[#35bec5]" />
              <span
                className="text-sm font-medium text-[#35bec5]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Mobile App
              </span>
            </div>

            <h2
              className="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Your Wellness Journey,{" "}
              <span
                className="bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] bg-clip-text text-transparent"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Always With You
              </span>
            </h2>

            <p
              className="text-base leading-relaxed text-slate-600"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Stay on track with SaKyi&apos;s mobile app — receive your weekly doctor updates,
              complete daily tasks, and monitor your health progress anytime, anywhere.
            </p>
          </div>

          {/* App Store Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="#app"
              className="group relative inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on App Store
            </Link>
            <Link
              href="#app"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#35bec5] via-[#4bc4db] to-[#0c96c4] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.627L13.5 12l4.198-2.491zM5.864 2.658L16.802 8.99l-2.302 2.302-8.636-8.634z" />
              </svg>
              <span className="relative z-10">Get it on Play Store</span>
            </Link>
          </div>

          <p className="text-sm text-slate-500" style={{ fontFamily: "Inter, sans-serif" }}>
            Available on iOS and Android.
          </p>
        </div>

        {/* Right Column - App Mockups */}
        <div className="relative" data-aos="fade-left">
          <div className="flex justify-center space-x-6">
            {/* First Phone Mockup - Dashboard Screen */}
            <div className="group relative">
              <div className="h-[500px] w-[240px] rotate-12 transform overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Phone Status Bar */}
                <div className="flex items-center justify-between bg-white px-4 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                  </div>
                  <div className="text-xs font-semibold">9:41</div>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-4 rounded-sm border border-black">
                      <div className="m-0.5 h-1.5 w-3 rounded-sm bg-green-500"></div>
                    </div>
                    <div className="h-3 w-6 rounded-sm border border-black"></div>
                  </div>
                </div>

                {/* App Header */}
                <div className="bg-gradient-to-r from-[#35bec5] to-[#0c96c4] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">SaKyi Wellness</h3>
                      <p className="text-xs text-white/80">Your Health Journey</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="space-y-4 p-4">
                  {/* Welcome Card */}
                  <div className="rounded-xl bg-gradient-to-r from-[#35bec5]/10 to-[#0c96c4]/10 p-3">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Good Morning, Sarah!
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Ready for today&apos;s wellness journey?
                    </p>
                  </div>

                  {/* Progress Cards */}
                  <div className="space-y-2">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">Daily Steps</span>
                        <span className="text-xs font-semibold text-[#35bec5]">8,247</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]"
                          style={{ width: "82%" }}
                        ></div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-2">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700">Water Intake</span>
                        <span className="text-xs font-semibold text-[#35bec5]">
                          6/8 glasses
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-[#35bec5] to-[#0c96c4]"
                          style={{ width: "75%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Today's Tasks */}
                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-slate-800">
                      Today&apos;s Tasks
                    </h5>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-green-100">
                          <CheckCircle className="h-2.5 w-2.5 text-green-600" />
                        </div>
                        <span className="text-xs text-slate-600">Morning meditation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-slate-200"></div>
                        <span className="text-xs text-slate-600">30-min walk</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 rounded-full bg-slate-200"></div>
                        <span className="text-xs text-slate-600">Healthy lunch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-[#35bec5]/20 to-[#0c96c4]/20 blur-xl"></div>
            </div>

            {/* Second Phone Mockup - Progress Screen */}
            <div className="group relative -translate-y-8">
              <div className="h-[500px] w-[240px] -rotate-12 transform overflow-hidden rounded-3xl bg-white shadow-2xl">
                {/* Phone Status Bar */}
                <div className="flex items-center justify-between bg-white px-4 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                    <div className="h-1 w-1 rounded-full bg-black"></div>
                  </div>
                  <div className="text-xs font-semibold">9:41</div>
                  <div className="flex items-center space-x-1">
                    <div className="h-2 w-4 rounded-sm border border-black">
                      <div className="m-0.5 h-1.5 w-3 rounded-sm bg-green-500"></div>
                    </div>
                    <div className="h-3 w-6 rounded-sm border border-black"></div>
                  </div>
                </div>

                {/* App Header */}
                <div className="bg-gradient-to-r from-[#4bc4db] to-[#35bec5] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Progress</h3>
                      <p className="text-xs text-white/80">Week 3 of 12</p>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* Progress Content */}
                <div className="space-y-4 p-4">
                  {/* Weekly Overview */}
                  <div className="rounded-xl bg-gradient-to-r from-[#4bc4db]/10 to-[#35bec5]/10 p-3">
                    <h4 className="text-sm font-semibold text-slate-800">This Week</h4>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#4bc4db]">5</div>
                        <div className="text-xs text-slate-600">Days Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#35bec5]">12</div>
                        <div className="text-xs text-slate-600">Goals Met</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-[#0c96c4]">85%</div>
                        <div className="text-xs text-slate-600">Success Rate</div>
                      </div>
                    </div>
                  </div>

                  {/* Chart Placeholder */}
                  <div className="rounded-lg bg-slate-50 p-3">
                    <h5 className="mb-2 text-xs font-semibold text-slate-800">
                      Weekly Progress
                    </h5>
                    <div className="flex h-16 items-end justify-between">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-3 rounded-t bg-gradient-to-t from-[#35bec5] to-[#4bc4db]"
                          style={{ height: "60%" }}
                        ></div>
                        <span className="mt-1 text-xs text-slate-500">Mon</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-3 rounded-t bg-gradient-to-t from-[#35bec5] to-[#4bc4db]"
                          style={{ height: "80%" }}
                        ></div>
                        <span className="mt-1 text-xs text-slate-500">Tue</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-3 rounded-t bg-gradient-to-t from-[#35bec5] to-[#4bc4db]"
                          style={{ height: "100%" }}
                        ></div>
                        <span className="mt-1 text-xs text-slate-500">Wed</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-3 rounded-t bg-gradient-to-t from-[#35bec5] to-[#4bc4db]"
                          style={{ height: "70%" }}
                        ></div>
                        <span className="mt-1 text-xs text-slate-500">Thu</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-3 rounded-t bg-gradient-to-t from-[#35bec5] to-[#4bc4db]"
                          style={{ height: "90%" }}
                        ></div>
                        <span className="mt-1 text-xs text-slate-500">Fri</span>
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  <div>
                    <h5 className="mb-2 text-xs font-semibold text-slate-800">
                      Recent Achievements
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 rounded-lg bg-yellow-50 p-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs text-slate-700">7-day streak!</span>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg bg-green-50 p-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span className="text-xs text-slate-700">Goal completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-[#4bc4db]/20 to-[#35bec5]/20 blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}