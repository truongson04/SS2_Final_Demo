<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
    const user = ref({name:"Bảo"})
    const router = useRouter();
    const logoutUser=()=>{
        router.push({
            path:"/"
        })
    }
</script>
<template>
   <div class="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10">
    <nav class="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 transition-all">
        
        <router-link to="/" class="flex items-center gap-2 group">
            <div class="h-8 w-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm shadow-lg group-hover:shadow-cyan-500/25 transition">CV</div>
            <span class="font-bold text-lg tracking-tight text-white hidden sm:block">CVBuilder</span>
        </router-link>

        <div class="flex items-center gap-6">
            
            <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-white/10 flex items-center justify-center text-xs font-bold text-cyan-400">
                    {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <p class="text-sm font-medium text-slate-300 max-sm:hidden">
                    Hi, <span class="text-white">{{ user.name }}</span>
                </p>
            </div>

            <div class="h-5 w-px bg-white/10 hidden sm:block"></div>

            <button @click="logoutUser" 
                class="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-900/50 text-slate-400 text-sm font-medium transition-all hover:text-white hover:border-cyan-500/50 hover:bg-slate-800 active:scale-95">
                <span>Logout</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" x2="9" y1="12" y2="12"></line>
                </svg>
            </button>
        </div>
    </nav>
</div>

</template>