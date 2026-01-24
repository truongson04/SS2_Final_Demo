<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router=useRouter();

const menuClass = ref("fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 -translate-x-full");
const openMenu = ()=>{
    menuClass.value="fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 translate-x-0"
}
const closeMenu=()=>{
    menuClass.value="fixed inset-0 z-[100] bg-white/60 text-slate-800 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 -translate-x-full"
}
const toApp =(state)=>{
    if(!state){
        router.push("/app");
    }
   router.push({
    path:"/app",
    query:{state:state}
   })
}
</script>
<template>
<section class="relative min-h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
    <div class="absolute inset-0 bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-with-grid.png')] bg-cover bg-center opacity-10 pointer-events-none"></div>
    
    <div class="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>

    <nav class="z-50 flex items-center justify-between w-full py-6 px-6 md:px-12 lg:px-24 border-b border-white/10 backdrop-blur-md">
        <a href="https://prebuiltui.com" class="flex items-center gap-2">
            <div class="h-10 w-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl">CV</div>
            <span class="font-bold text-xl tracking-tight text-white">CVBuilder</span>
        </a>

        <div class="hidden md:flex items-center gap-8 font-medium">
            <router-link to="/" class="text-slate-300 hover:text-cyan-400 transition duration-300">
                Home
            </router-link>
            <router-link to="/products" class="text-slate-300 hover:text-cyan-400 transition duration-300">
                Templates
            </router-link>
            <a href="/stories" class="text-slate-300 hover:text-cyan-400 transition duration-300">
                Testimonials
            </a>
            <a href="/pricing" class="text-slate-300 hover:text-cyan-400 transition duration-300">
                Contact 
            </a>
        </div>

        <div class="hidden md:flex items-center gap-4">
            <button class="hover:text-cyan-400 transition text-slate-300 font-medium px-4" @click="toApp('login')">
                Login
            </button>
            <button class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition text-white font-semibold rounded-full shadow-lg shadow-cyan-500/25" @click="toApp('register')">
                Create CV Now
            </button>
        </div>

        <button id="open-menu" class="md:hidden text-white" @click="openMenu">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></svg>
        </button>
    </nav>

    <div id="mobile-navLinks" :class="menuClass" class="bg-slate-900/95 backdrop-blur-xl border-l border-white/10 text-white">
         <a href="/">

            Home

        </a>

        <a href="/products">

            Products

        </a>

        <a href="/stories">

            Stories

        </a>

        <a href="/pricing">

            Pricing

        </a>

        <button id="close-menu" class="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-slate-100 hover:bg-slate-200 transition text-black rounded-md flex" @click="closeMenu">

            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>

        </button>
        </div>
    

    <main class="flex-grow flex items-center justify-center px-6 md:px-12 lg:px-24 py-12">
        <div class="grid lg:grid-cols-2 gap-12 items-center max-w-7xl w-full">
            
            <div class="flex flex-col items-start space-y-8 z-10">
                <a href="#" class="inline-flex items-center gap-2 border border-cyan-500/30 rounded-full p-1 pr-4 bg-cyan-950/30 backdrop-blur-sm hover:border-cyan-400 transition group">
                    <span class="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full group-hover:bg-cyan-400 transition">NEW</span>
                    <p class="text-sm font-medium text-cyan-200 flex items-center gap-1">
                        AI Resume Analysis
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </p>
                </a>

                <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                    Build a <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Professional CV</span> in minutes.
                </h1>
                
                <p class="text-lg text-slate-400 max-w-lg leading-relaxed">
                    Stand out from the crowd with our sleek, dark-themed templates and AI-powered suggestions. Land your dream job faster.
                </p>

                <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <button @click="toApp" class="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-950 hover:bg-cyan-500 font-bold   rounded-full px-8 h-12 transition active:scale-95">
                        Get started for free
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.166 10h11.667m0 0L9.999 4.165m5.834 5.833-5.834 5.834" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button class="w-full sm:w-auto border border-slate-600 text-slate-300 hover:text-white hover:border-white transition rounded-full px-8 h-12 font-medium">
                        View Examples
                    </button>
                </div>
                
                <div class="pt-4 flex items-center gap-4 text-sm text-slate-500">
                    <div class="flex -space-x-2">
                        <div class="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950"></div>
                        <div class="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-950"></div>
                        <div class="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-950"></div>
                    </div>
                    <p>Trusted by 10,000+ job seekers</p>
                </div>
            </div>

            <div class="relative group z-10 flex justify-center lg:justify-end">
                <div class="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-[20px] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700"></div>
                
                <div class="relative rounded-[20px] bg-slate-900 border border-white/10 p-2 shadow-2xl transform transition duration-500 hover:scale-[1.02] hover:-rotate-1">
                    <img src="../../assets/demo_CV.png"
                        class="w-full max-w-md h-auto rounded-[15px] object-cover shadow-inner"
                        alt="Professional CV Template Showcase"
                    />
                    
                    <div class="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur border border-white/10 p-4 rounded-xl shadow-xl animate-bounce" style="animation-duration: 3s;">
                        <div class="flex items-center gap-3">
                            <div class="bg-green-500/20 p-2 rounded-lg text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <div>
                                <p class="text-xs text-slate-400">Status</p>
                                <p class="text-sm font-bold text-white">Hired</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </main>
</section>
</template>
<style scoped>
     .marquee-inner {
        animation: marqueeScroll 35s linear infinite;
    }

    @keyframes marqueeScroll {
        0% {
            transform: translateX(0%);
        }

        100% {
            transform: translateX(-50%);
        }
    }
</style>