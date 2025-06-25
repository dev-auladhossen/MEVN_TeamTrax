<template>
  <Layout>
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold flex items-center gap-2">
          <font-awesome-icon icon="note-sticky" /> Daily Stand-Up
        </h1>
        <div class="flex gap-4 items-center">
          <input
            type="date"
            v-model="selectedDate"
            class="border rounded px-2 py-1"
          />
          <select v-model="selectedProject" class="border rounded px-2 py-1">
            <option value="All">All Projects</option>
            <option v-for="project in projects" :key="project">
              {{ project }}
            </option>
          </select>
        </div>
      </div>

      <!-- Stand-Up Submission Summary -->
      <div class="text-gray-600 text-sm">
        ✅ {{ submittedCount }} submitted • ❌ {{ notSubmittedCount }} not
        submitted
      </div>

      <!-- Stand-Up Creation Form -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-if="isLoggedIn && !hasSubmittedToday"
          class="bg-white p-4 rounded shadow space-y-4 border"
        >
          <h2 class="text-xl font-semibold">Create Today’s Stand-Up</h2>
          <div class="grid gap-4">
            <label class="flex flex-col text-sm">
              <span>Yesterday’s Work</span>
              <input
                v-model="form.yesterday"
                class="border rounded px-2 py-1"
              />
            </label>
            <label class="flex flex-col text-sm">
              <span>Today’s Plan</span>
              <input v-model="form.today" class="border rounded px-2 py-1" />
            </label>
            <label class="flex flex-col text-sm">
              <span>Blocker (if any)</span>
              <input v-model="form.blocker" class="border rounded px-2 py-1" />
            </label>
            <label class="flex flex-col text-sm">
              <span>Attachment</span>
              <input
                v-model="form.attachment"
                class="border rounded px-2 py-1"
              />
            </label>
            <label class="flex flex-col text-sm">
              <span>Related Link</span>
              <input v-model="form.link" class="border rounded px-2 py-1" />
            </label>
            <button
              @click="submitForm"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-start"
            >
              Submit Stand-Up
            </button>
          </div>
        </div>

        <!-- No Entries Placeholder -->
        <div
          v-if="filteredEntries.length === 0"
          class="text-gray-500 italic col-span-full text-center mt-6"
        >
          No stand-ups submitted yet for this date and project.
        </div>

        <!-- Stand-Up Summary Cards -->
        <div
          v-for="entry in filteredEntries"
          :key="entry.id"
          class="bg-white rounded-xl shadow-md border p-4 space-y-3 relative"
        >
          <div class="flex items-center justify-between">
            <div class="font-semibold text-lg flex items-center gap-2">
              <font-awesome-icon icon="user-circle" /> {{ entry.user }}
            </div>
            <span :class="entry.submitted ? 'text-green-600' : 'text-red-600'">
              {{ entry.submitted ? "✅ Submitted" : "❌ Not Submitted" }}
            </span>
          </div>

          <template v-if="entry.submitted">
            <div class="text-sm">
              <strong
                ><font-awesome-icon icon="clipboard-check" /> Yesterday:</strong
              >
              {{ entry.yesterday }}
            </div>
            <div class="text-sm">
              <strong><font-awesome-icon icon="tasks-alt" /> Today:</strong>
              {{ entry.today }}
            </div>
            <div class="text-sm text-red-600" v-if="entry.blocker">
              <strong><font-awesome-icon icon="bug" /> Blocker:</strong>
              {{ entry.blocker }}
            </div>
            <div class="text-sm text-blue-600" v-if="entry.links.length">
              <strong
                ><font-awesome-icon icon="arrow-up-right-from-square" />
                Links:</strong
              >
              <ul class="list-disc ml-4">
                <li v-for="(link, index) in entry.links" :key="index">
                  <a
                    :href="link"
                    target="_blank"
                    class="underline text-blue-500"
                  >
                    {{ link }}
                  </a>
                </li>
              </ul>
            </div>
            <div v-if="entry.attachment" class="text-sm">
              <strong
                ><font-awesome-icon icon="paperclip" /> Attachment:</strong
              >
              {{ entry.attachment }}
            </div>

            <!-- Comments -->
            <div class="mt-3 border-t pt-3 space-y-2">
              <div class="flex items-center gap-2">
                <input
                  v-model="entry.newComment"
                  placeholder="Add a comment..."
                  class="w-full border rounded px-2 py-1"
                />
                <button
                  @click="addComment(entry.id)"
                  class="text-blue-600 hover:underline"
                >
                  Post
                </button>
              </div>
              <div
                v-for="(comment, index) in entry.comments"
                :key="index"
                class="text-sm text-gray-700 pl-6 relative"
              >
                <font-awesome-icon
                  icon="user"
                  class="absolute left-0 top-1 text-gray-400"
                />
                <span>{{ comment }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed } from "vue";
import Layout from "../components/Layout.vue";

const selectedDate = ref(new Date().toISOString().substr(0, 10));
const selectedProject = ref("All");
const currentUser = "Current User"; // Replace with actual auth system
const isLoggedIn = true;

const projects = ["Project Alpha", "Project Beta", "Project Gamma"];

const form = ref({
  yesterday: "",
  today: "",
  blocker: "",
  attachment: "",
  link: "",
});

// Dummy entries (would come from backend in real app)
const dummyEntries = ref([
  {
    id: 1,
    user: "John Doe",
    submitted: true,
    date: "2025-06-26",
    yesterday: "Fixed login bug in #234",
    today: "Start dashboard UI",
    blocker: "Waiting for API spec",
    links: ["https://github.com/org/repo/pull/123"],
    attachment: "api_spec.pdf",
    project: "Project Alpha",
    comments: ["Looks good!", "Don’t forget to check the spec update."],
    newComment: "",
  },
  {
    id: 2,
    user: "Jane Smith",
    submitted: false,
    date: "2025-06-26",
    project: "Project Beta",
    comments: [],
    newComment: "",
  },
  {
    id: 3,
    user: "Alice Lee",
    submitted: true,
    date: "2025-06-25",
    yesterday: "Refactored task service",
    today: "Implement role-based UI",
    blocker: "",
    links: [],
    attachment: "",
    project: "Project Alpha",
    comments: [],
    newComment: "",
  },
]);

const filteredEntries = computed(() =>
  dummyEntries.value.filter(
    (e) =>
      (selectedProject.value === "All" ||
        e.project === selectedProject.value) &&
      e.date === selectedDate.value
  )
);

const submittedCount = computed(
  () => filteredEntries.value.filter((e) => e.submitted).length
);
const notSubmittedCount = computed(
  () => filteredEntries.value.filter((e) => !e.submitted).length
);

const hasSubmittedToday = computed(() =>
  dummyEntries.value.some(
    (e) => e.user === currentUser && e.date === selectedDate.value
  )
);

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function submitForm() {
  if (!form.value.yesterday || !form.value.today) {
    alert("Please fill in yesterday’s work and today’s plan.");
    return;
  }

  if (form.value.link && !isValidURL(form.value.link)) {
    alert("Please enter a valid link (e.g., https://...)");
    return;
  }

  const newEntry = {
    id: Date.now(),
    user: currentUser,
    submitted: true,
    date: selectedDate.value,
    yesterday: form.value.yesterday,
    today: form.value.today,
    blocker: form.value.blocker,
    links: form.value.link ? [form.value.link] : [],
    attachment: form.value.attachment,
    project:
      selectedProject.value === "All" ? "Project Alpha" : selectedProject.value,
    comments: [],
    newComment: "",
  };

  dummyEntries.value.unshift(newEntry);

  form.value = {
    yesterday: "",
    today: "",
    blocker: "",
    attachment: "",
    link: "",
  };

  alert("✅ Stand-up submitted!");
}

function addComment(entryId) {
  const entry = dummyEntries.value.find((e) => e.id === entryId);
  if (entry && entry.newComment.trim() !== "") {
    entry.comments.push(entry.newComment.trim());
    entry.newComment = "";
  }
}
</script>

<style scoped>
body {
  font-family: "Inter", sans-serif;
  background-color: #f9fafb;
}
</style>
