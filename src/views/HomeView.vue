<template>
  <HeroSection />
  <Section5 />
  <Section2 />
  <ServicesSection />
  <Section4 />
  <PortfolioSection :featured-only="true" />
  <TeamSection />
  <Section6 />
  <PartnersSection />
  <BlogPreview />
  <CTASection />
</template>

<script setup>
import { defineAsyncComponent } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'

const Section5 = defineAsyncComponent(() => import('@/components/sections/Section5.vue'))
const Section2 = defineAsyncComponent(() => import('@/components/sections/Section2.vue'))
const ServicesSection = defineAsyncComponent(() => import('@/components/sections/ServicesSection.vue'))
const Section4 = defineAsyncComponent(() => import('@/components/sections/Section4.vue'))
const PortfolioSection = defineAsyncComponent(() => import('@/components/sections/PortfolioSection.vue'))
const TeamSection = defineAsyncComponent(() => import('@/components/sections/TeamSection.vue'))
const Section6 = defineAsyncComponent(() => import('@/components/sections/Section6.vue'))
const PartnersSection = defineAsyncComponent(() => import('@/components/sections/PartnersSection.vue'))
const BlogPreview = defineAsyncComponent(() => import('@/components/sections/BlogPreview.vue'))
const CTASection = defineAsyncComponent(() => import('@/components/sections/CTASection.vue'))
</script>
