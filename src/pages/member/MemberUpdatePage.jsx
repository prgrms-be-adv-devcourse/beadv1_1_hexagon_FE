
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import api from "../../api/api"

const S3_BASE_URL = process.env.REACT_APP_S3_BASE_URL

export default function MemberUpdatePage() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    phoneNumber: "",
    birthDate: "",
    gender: "MAN",
    name: "",
    profileImageKey: "",
  })

  const [loading, setLoading] = useState(true)
  const [isNicknameChecked, setIsNicknameChecked] = useState(true)
  const [originalNickname, setOriginalNickname] = useState("")
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [originalProfileImage, setOriginalProfileImage] = useState({
    key: "",
    preview: null,
  })

  const handleRemoveImage = () => {
    if (window.confirm("프로필 이미지를 삭제하시겠습니까?")) {
      if (profileImagePreview && profileImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(profileImagePreview)
      }
      setProfileImagePreview(null)
      setFormData((prev) => ({
        ...prev,
        profileImageKey: "",
      }))
      setOriginalProfileImage({
        key: "",
        preview: null,
      })
    }
  }

  useEffect(() => {
    const fetchMyInfo = async () => {
      try {
        const res = await api.get("/members/me")
        const data = res.data.data
        const info = data.info
        const images = data.images || []

        const nickName = info.nickName || ""
        const phoneNumber = info.phoneNumber || ""
        const birthDay = info.birthDay || ""
        const gender = info.gender || "MAN"

        let imageKey = ""
        let imagePreview = null
        if (images.length > 0 && images[0].fileType === "IMAGE") {
          const { key, queryString } = images[0]
          imageKey = key
          imagePreview = `${S3_BASE_URL}/${key}${queryString}`
        }

        setFormData({
          name: nickName,
          phoneNumber,
          birthDate: birthDay,
          gender,
          profileImageKey: imageKey,
        })

        setOriginalNickname(nickName)
        setIsNicknameChecked(true)
        setProfileImagePreview(imagePreview)
        setOriginalProfileImage({
          key: imageKey,
          preview: imagePreview,
        })
      } catch (error) {
        console.error("내 정보 조회 에러:", error)
        alert("회원 정보를 불러오는데 실패했습니다.")
        navigate("/", { replace: true })
      } finally {
        setLoading(false)
      }
    }

    fetchMyInfo()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "name") {
      if (value === originalNickname) {
        setIsNicknameChecked(true)
      } else {
        setIsNicknameChecked(false)
      }
    }
  }

  const handleGenderChange = (selectedGender) => {
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
    }))
  }

  const handleNicknameCheck = async () => {
    if (!formData.name) {
      alert("닉네임을 입력해주세요.")
      return
    }

    try {
      await api.get(`/members/check-name?name=${formData.name}`)
      alert("사용 가능한 닉네임입니다.")
      setIsNicknameChecked(true)
    } catch (error) {
      console.error("닉네임 중복 확인 에러:", error)
      alert("이미 사용 중인 닉네임입니다.")
      setIsNicknameChecked(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) {
      setProfileImagePreview(originalProfileImage.preview)
      setFormData((prev) => ({
        ...prev,
        profileImageKey: originalProfileImage.key,
      }))
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setProfileImagePreview(previewUrl)

    try {
      const presignedResponse = await api.post("/s3/upload-url", {
        serviceName: "MEMBERS",
        fileName: file.name,
        contentType: file.type,
      })

      const { key, queryString } = presignedResponse.data.data
      const presignedUrl = `${S3_BASE_URL}/${key}${queryString}`

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
      })

      setFormData((prev) => ({
        ...prev,
        profileImageKey: key,
      }))

      alert("이미지 업로드가 완료되었습니다.")
    } catch (error) {
      console.error("이미지 업로드 에러:", error)
      alert("이미지 업로드 중 오류가 발생했습니다.")
      setProfileImagePreview(originalProfileImage.preview)
      setFormData((prev) => ({
        ...prev,
        profileImageKey: originalProfileImage.key,
      }))
    }
  }

  const handleUpdate = async () => {
    if (!formData.phoneNumber || !formData.birthDate || !formData.name) {
      alert("모든 정보를 입력해주세요.")
      return
    }

    if (!isNicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.")
      return
    }

    try {
      await api.patch("/members", {
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate,
        gender: formData.gender,
        name: formData.name,
        profileImageKey: formData.profileImageKey,
      })

      alert("회원 정보가 수정되었습니다.")
      navigate("/mypage", { replace: true })
    } catch (error) {
      console.error("회원 정보 수정 에러:", error)
      const msg = error.response?.data?.message || error.message
      alert(`회원 정보 수정 중 오류가 발생했습니다: ${msg}`)
    }
  }

  if (loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-gray-600 text-lg font-medium">로딩 중...</div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-white">

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">

            <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-md">
              {/* 프로필 이미지 */}
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-3">프로필 이미지</label>

                {profileImagePreview && (
                    <div className="relative inline-block mb-4">
                      <img
                          src={profileImagePreview || "/placeholder.svg"}
                          alt="Profile Preview"
                          className="w-40 h-40 object-cover rounded-full shadow-md border-4 border-[#3b82f6]"
                      />
                      <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center font-bold transition-colors"
                      >
                        ×
                      </button>
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none transition-colors"
                />
              </div>

              {/* 닉네임 */}
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-3">닉네임</label>
                <div className="flex gap-2">
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="닉네임을 입력하세요"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none transition-colors"
                  />
                  <button
                      onClick={handleNicknameCheck}
                      disabled={isNicknameChecked}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                          isNicknameChecked
                              ? "bg-green-600 text-white cursor-default"
                              : "bg-[#3b82f6] text-white hover:bg-[#2563eb]"
                      }`}
                  >
                    {isNicknameChecked ? "확인완료" : "중복확인"}
                  </button>
                </div>
              </div>

              {/* 전화번호 */}
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-3">전화번호</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-[#3b82f6] focus:outline-none transition-colors"
                />
              </div>

              {/* 생년월일 */}
              <div className="mb-6">
                <label className="block text-gray-900 font-semibold mb-3">생년월일</label>
                <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:border-[#3b82f6] focus:outline-none transition-colors"
                />
              </div>

              {/* 성별 */}
              <div className="mb-8">
                <label className="block text-gray-900 font-semibold mb-3">성별</label>
                <div className="flex gap-3">
                  <button
                      onClick={() => handleGenderChange("MAN")}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          formData.gender === "MAN"
                              ? "bg-[#3b82f6] text-white"
                              : "bg-white border border-gray-300 text-gray-900 hover:border-gray-400"
                      }`}
                  >
                    남성
                  </button>
                  <button
                      onClick={() => handleGenderChange("FEMALE")}
                      className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                          formData.gender === "FEMALE"
                              ? "bg-[#3b82f6] text-white"
                              : "bg-white border border-gray-300 text-gray-900 hover:border-gray-400"
                      }`}
                  >
                    여성
                  </button>
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-3">
                <button
                    onClick={handleUpdate}
                    disabled={!isNicknameChecked}
                    className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  수정완료
                </button>
                <button
                    onClick={() => navigate("/mypage", { replace: true })}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 py-3 rounded-lg font-semibold transition-colors"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
  )
}
