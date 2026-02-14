<script setup>
const reviewsRow1 = [
  {
    text: "Mình chật vật mãi không được gọi phỏng vấn. Dùng tool này xong, nộp 3 chỗ thì được gọi 2. Tính năng AI gợi ý nội dung thực sự đỉnh.",
    name: "Nguyễn Thùy Linh",
    role: "Frontend Dev @ VNG",
    img: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },
  {
    text: "Giao diện Dark mode nhìn quá chất. CV của mình nổi bật hẳn. Thích nhất là đổi template thoải mái mà không phải nhập lại dữ liệu từ đầu.",
    name: "Trần Minh Đức",
    role: "Product Designer @ Momo",
    img: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },
  {
    text: "Gọn gàng, chuyên nghiệp và nhanh. Xuất file PDF nét căng.",
    name: "Phạm Hoàng Nam",
    role: "Marketing @ Shopee",
    img: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },
  {
    text: "Cuối cùng cũng tìm được công cụ tạo CV hiểu chuẩn ngành Tech. Phần gợi ý kỹ năng (Skill) cực kỳ sát thực tế.",
    name: "Lê Văn Hùng",
    role: "DevOps @ FPT Software",
    img: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },
];

const reviewsRow2 = [
  {
    text: "Đơn giản, trực quan và hiệu quả. Giảm hẳn áp lực khi đi xin việc. Mình đã nhận được offer chỉ sau 2 tuần.",
    name: "Vũ Tuấn Anh",
    role: "Data Analyst @ Viettel",
    img: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },

  {
    text: "Mình thích việc có thể tùy chỉnh màu sắc để hợp với thương hiệu cá nhân. Công cụ rất linh hoạt.",
    name: "Hoàng Văn Sơn",
    role: "Freelancer",
    img: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg",
  },
];
</script>

<template>
  <section
    class="relative py-24 bg-slate-950 text-white overflow-hidden border-t border-white/5"
  >
    <div
      class="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
    ></div>

    <div class="relative z-10 max-w-[100vw] mx-auto">
      <div class="text-center mb-16 px-6">
        <h2 class="text-3xl md:text-5xl font-bold mb-4">
          Loved by
          <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            >Thousands</span
          >
        </h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">
          Join the community of professionals who upgraded their careers.
        </p>
      </div>

      <div class="group flex overflow-hidden mask-gradient mb-8">
        <div class="flex gap-6 animate-infinite-scroll pl-6 w-max">
          <div
            v-for="(review, index) in [...reviewsRow1, ...reviewsRow1]"
            :key="index"
            class="w-[350px] p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/50 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center gap-1 mb-3 text-yellow-400">
                <span class="text-lg">★★★★★</span>
              </div>
              <p
                class="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-3"
              >
                "{{ review.text }}"
              </p>
            </div>
            <div class="flex items-center gap-3">
              <img
                :src="review.img"
                class="w-10 h-10 rounded-full border border-slate-700"
              />
              <div>
                <h4 class="font-bold text-white text-sm">{{ review.name }}</h4>
                <p class="text-xs text-cyan-400">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="group flex overflow-hidden mask-gradient">
        <div class="flex gap-6 animate-infinite-scroll-reverse pl-6 w-max">
          <div
            v-for="(review, index) in [...reviewsRow2, ...reviewsRow2]"
            :key="index"
            class="w-[350px] p-6 rounded-2xl bg-slate-900 border border-white/10 hover:border-cyan-500/50 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center gap-1 mb-3 text-yellow-400">
                <span class="text-lg">★★★★★</span>
              </div>
              <p
                class="text-slate-300 text-sm mb-4 leading-relaxed line-clamp-3"
              >
                "{{ review.text }}"
              </p>
            </div>
            <div class="flex items-center gap-3">
              <img
                :src="review.img"
                class="w-10 h-10 rounded-full border border-slate-700"
              />
              <div>
                <h4 class="font-bold text-white text-sm">{{ review.name }}</h4>
                <p class="text-xs text-cyan-400">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"
      ></div>
      <div
        class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"
      ></div>
    </div>
  </section>
</template>

<style>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-infinite-scroll {
  animation: scroll 40s linear infinite;
}
.animate-infinite-scroll-reverse {
  animation: scroll 45s linear infinite reverse;
}
.group:hover .animate-infinite-scroll,
.group:hover .animate-infinite-scroll-reverse {
  animation-play-state: paused;
}
</style>
