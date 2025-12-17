import { Link } from "react-router-dom"
import { Search, Users, Briefcase, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
      <div className="min-h-screen bg-[#1a2332]">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-4 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                프리랜서와 클라이언트를 연결하는
                <span className="block text-[#3b82f6] mt-2">이어드림</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                당신의 프로젝트에 완벽한 프리랜서를 찾고, 전문가로서 성장할 수 있는 기회를 만나보세요. 신뢰할 수 있는
                협업을 시작하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/search/commissions">
                  <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                    의뢰 찾기
                  </button>
                </Link>
                <Link to="/search/promotions">
                  <button className="border-2 border-white text-white hover:bg-white hover:text-[#1a2332] px-8 py-4 rounded-lg text-lg font-semibold bg-transparent transition-colors">
                    프리랜서 찾기
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#3b82f6]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-[#0f1419]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">왜 이어드림인가요?</h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              프리랜서와 클라이언트 모두를 위한 최적화된 플랫폼
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#1a2332] border border-gray-700 rounded-lg p-6 hover:border-[#3b82f6] transition-colors">
                <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">간편한 검색</h3>
                <p className="text-gray-400 leading-relaxed">
                  필요한 프로젝트와 전문가를 빠르게 찾을 수 있는 스마트 검색 시스템
                </p>
              </div>

              <div className="bg-[#1a2332] border border-gray-700 rounded-lg p-6 hover:border-[#3b82f6] transition-colors">
                <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">검증된 전문가</h3>
                <p className="text-gray-400 leading-relaxed">평점과 리뷰를 통해 신뢰할 수 있는 프리랜서를 만나보세요</p>
              </div>

              <div className="bg-[#1a2332] border border-gray-700 rounded-lg p-6 hover:border-[#3b82f6] transition-colors">
                <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">안전한 거래</h3>
                <p className="text-gray-400 leading-relaxed">체계적인 계약 시스템으로 안전하고 투명한 프로젝트 진행</p>
              </div>

              <div className="bg-[#1a2332] border border-gray-700 rounded-lg p-6 hover:border-[#3b82f6] transition-colors">
                <div className="w-12 h-12 bg-[#3b82f6]/20 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-[#3b82f6]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">성장 기회</h3>
                <p className="text-gray-400 leading-relaxed">
                  다양한 프로젝트를 통해 포트폴리오를 쌓고 전문가로 성장하세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-[#1a2332]">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-5xl font-bold text-[#3b82f6] mb-2">1,200+</div>
                <p className="text-gray-300 text-lg">등록된 프리랜서</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#3b82f6] mb-2">850+</div>
                <p className="text-gray-300 text-lg">완료된 프로젝트</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-[#3b82f6] mb-2">98%</div>
                <p className="text-gray-300 text-lg">고객 만족도</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#0f1419]">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">지금 바로 시작하세요</h2>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                무료로 가입하고 당신의 다음 프로젝트나 기회를 찾아보세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
                    시작하기
                  </button>
                </Link>
                <Link to="/search/commissions">
                  <button className="border-2 border-gray-600 text-white hover:bg-white hover:text-[#1a2332] px-8 py-4 rounded-lg text-lg font-semibold bg-transparent transition-colors">
                    둘러보기
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}
