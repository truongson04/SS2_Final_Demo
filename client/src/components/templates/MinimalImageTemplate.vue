<script setup>
import { defineProps } from "vue";

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  accentColor: {
    type: String,
    default: "#2563eb",
  },
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length < 2) return dateStr;
  const year = parts[0];
  const month = parts[1];
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const getImageUrl = (image) => {
  if (typeof image === "string") {
    return image;
  }
};
</script>

<template>
  <div class="cv-wrapper">
    <!-- LEFT SIDEBAR -->
    <aside class="cv-sidebar" :style="{ color: accentColor }">
      <!-- Avatar -->
      <div class="avatar-wrap">
        <img
          v-if="data.personal_info?.image"
          :src="getImageUrl(data.personal_info.image)"
          alt="Profile"
          class="avatar-img"
        />
        <div v-else class="avatar-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      </div>

      <div class="sidebar-name">
        <h1 class="sidebar-full-name">
          {{ data.personal_info?.full_name || "Your Name" }}
        </h1>
        <p class="sidebar-profession">
          {{ data.personal_info?.profession || "Profession" }}
        </p>
      </div>

      <div class="sidebar-divider"></div>

      <section class="sidebar-section">
        <h2 class="sidebar-section-title">CONTACT</h2>
        <div class="contact-list">
          <div v-if="data.personal_info?.phone" class="contact-item">
            <span class="contact-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                />
              </svg>
            </span>
            <span>{{ data.personal_info.phone }}</span>
          </div>
          <div v-if="data.personal_info?.email" class="contact-item">
            <span class="contact-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <span>{{ data.personal_info.email }}</span>
          </div>
          <div v-if="data.personal_info?.location" class="contact-item">
            <span class="contact-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span>{{ data.personal_info.location }}</span>
          </div>
        </div>
      </section>

      <section
        v-if="data.education && data.education.length > 0"
        class="sidebar-section"
      >
        <h2 class="sidebar-section-title">EDUCATION</h2>
        <div class="edu-list">
          <div
            v-for="(edu, index) in data.education"
            :key="index"
            class="edu-item"
          >
            <p class="edu-degree">{{ edu.degree }}</p>
            <p class="edu-institution">{{ edu.institution }}</p>
            <p class="edu-date">{{ formatDate(edu.graduation_date) }}</p>
          </div>
        </div>
      </section>

      <!-- Skills -->
      <section
        v-if="data.skills && data.skills.length > 0"
        class="sidebar-section"
      >
        <h2 class="sidebar-section-title">SKILLS</h2>
        <ul class="skills-list">
          <li
            v-for="(skill, index) in data.skills"
            :key="index"
            class="skill-item"
          >
            <span
              class="skill-dot"
              :style="{ backgroundColor: accentColor }"
            ></span>
            {{ skill }}
          </li>
        </ul>
      </section>
    </aside>

    <main class="cv-main">
      <section v-if="data.professional_summary" class="main-section">
        <div class="section-header">
          <span
            class="section-bar"
            :style="{ backgroundColor: accentColor }"
          ></span>
          <h2 class="section-title" :style="{ color: accentColor }">PROFILE</h2>
        </div>
        <p class="summary-text">{{ data.professional_summary }}</p>
      </section>

      <section
        v-if="data.experience && data.experience.length > 0"
        class="main-section"
      >
        <div class="section-header">
          <span
            class="section-bar"
            :style="{ backgroundColor: accentColor }"
          ></span>
          <h2 class="section-title" :style="{ color: accentColor }">
            EXPERIENCE
          </h2>
        </div>
        <div class="timeline">
          <div
            v-for="(exp, index) in data.experience"
            :key="index"
            class="timeline-item"
          >
            <div
              class="timeline-dot"
              :style="{ borderColor: accentColor }"
            ></div>
            <div class="timeline-content">
              <div class="exp-header">
                <h3 class="exp-position">{{ exp.position }}</h3>
                <span class="exp-date">
                  {{ formatDate(exp.start_date) }} –
                  {{ exp.is_current ? "Present" : formatDate(exp.end_date) }}
                </span>
              </div>
              <p class="exp-company" :style="{ color: accentColor }">
                {{ exp.company }}
              </p>
              <ul v-if="exp.description" class="exp-desc">
                <li v-for="(line, i) in exp.description.split('\n')" :key="i">
                  {{ line }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Projects -->
      <section
        v-if="data.project && data.project.length > 0"
        class="main-section"
      >
        <div class="section-header">
          <span
            class="section-bar"
            :style="{ backgroundColor: accentColor }"
          ></span>
          <h2 class="section-title" :style="{ color: accentColor }">
            PROJECTS
          </h2>
        </div>
        <div class="projects-list">
          <div
            v-for="(project, index) in data.project"
            :key="index"
            class="project-item"
          >
            <div class="project-top">
              <h3 class="project-name">{{ project.name }}</h3>
              <span
                class="project-type"
                :style="{ color: accentColor, borderColor: accentColor }"
                >{{ project.type }}</span
              >
            </div>
            <ul v-if="project.description" class="exp-desc">
              <li v-for="(line, i) in project.description.split('\n')" :key="i">
                {{ line }}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
.cv-wrapper {
  display: flex;
  min-height: 100%;
  background: #fff;
  font-family: "Segoe UI", "Inter", Arial, sans-serif;
  color: #1e293b;
  font-size: 13px;
  line-height: 1.6;
}

.cv-sidebar {
  width: 270px;
  min-width: 270px;

  color: #fff;
  padding: 36px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.avatar-img {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18);
}
.avatar-placeholder {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 4px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar-name {
  text-align: center;
  margin-bottom: 20px;
}
.sidebar-full-name {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.04em;

  margin: 0 0 4px 0;
  line-height: 1.2;
}
.sidebar-profession {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;

  margin: 0;
}

.sidebar-divider {
  width: 100%;
  height: 1px;

  margin-bottom: 24px;
}

/* Sidebar Sections */
.sidebar-section {
  margin-bottom: 26px;
}
.sidebar-section-title {
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.18em;

  text-transform: uppercase;
  margin: 0 0 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  padding-bottom: 6px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;

  word-break: break-all;
}
.contact-icon {
  margin-top: 1px;
  flex-shrink: 0;
  opacity: 0.85;
}

.edu-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.edu-item {
}
.edu-degree {
  font-weight: 600;
  font-size: 12px;

  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}
.edu-institution {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.75);
  margin: 2px 0 0 0;
}
.edu-date {
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.55);
  margin: 2px 0 0 0;
}

.skills-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.skill-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}
.skill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;

  flex-shrink: 0;
}

.cv-main {
  flex: 1;
  padding: 36px 36px 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #fff;
}

/* Section */
.main-section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.section-bar {
  display: inline-block;
  width: 4px;
  height: 18px;
  border-radius: 2px;
  flex-shrink: 0;
}
.section-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0;
}

.summary-text {
  font-size: 13px;
  color: #475569;
  line-height: 1.7;
  margin: 0;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 8px;
}
.timeline-item {
  display: flex;
  gap: 14px;
  position: relative;
}
.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #2563eb;
  background: #fff;
  flex-shrink: 0;
  margin-top: 4px;
}
.timeline-content {
  flex: 1;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}
.timeline-item:last-child .timeline-content {
  border-bottom: none;
  padding-bottom: 0;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
.exp-position {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}
.exp-date {
  font-size: 11px;
  color: #94a3b8;
  white-space: nowrap;
  flex-shrink: 0;
}
.exp-company {
  font-size: 12px;
  font-weight: 500;
  margin: 3px 0 6px 0;
}
.exp-desc {
  list-style: disc;
  padding-left: 16px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.exp-desc li {
  font-size: 12.5px;
  color: #475569;
  line-height: 1.6;
}

/* Projects */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.project-item {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
}
.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.project-name {
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}
.project-type {
  font-size: 10.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: 1px solid;
  border-radius: 20px;
  padding: 1px 9px;
  flex-shrink: 0;
}
</style>
