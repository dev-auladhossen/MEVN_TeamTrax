<!-- Example Component using useToast composable -->
<template>
  <Layout>
    <div class="composable-example">
      <h2>Using Toast Composable</h2>

      <div class="button-group">
        <button @click="showSuccess" class="btn success">Success</button>
        <button @click="showError" class="btn error">Error</button>
        <button @click="showWarning" class="btn warning">Warning</button>
        <button @click="showInfo" class="btn info">Info</button>
        <button @click="showCustom" class="btn custom">Custom</button>
        <button @click="clearAll" class="btn clear">Clear All</button>
      </div>

      <!-- Form example with validation -->
      <div class="form-example">
        <h3>Form with Toast Validation</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              class="form-input"
              :class="{ error: emailError }"
            />
          </div>
          <div class="form-group">
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              class="form-input"
              :class="{ error: passwordError }"
            />
          </div>
          <button type="submit" class="btn submit">Submit</button>
        </form>
      </div>

      <!-- API simulation -->
      <div class="api-example">
        <h3>API Call Simulation</h3>
        <button @click="simulateApiCall" class="btn api" :disabled="loading">
          {{ loading ? "Loading..." : "Fetch Data" }}
        </button>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "../Composables/useToast.js";
import Layout from "../Layout.vue";

// Using the composable
const { success, error, warning, info, showToast, clear } = useToast();

// Form data
const email = ref("");
const password = ref("");
const emailError = ref(false);
const passwordError = ref(false);
const loading = ref(false);

// Simple toast examples
const showSuccess = () => {
  success("Operation completed successfully!");
};

const showError = () => {
  error("Something went wrong!", {
    title: "Error",
    duration: 6000,
  });
};

const showWarning = () => {
  warning("Please check your input", {
    title: "Warning",
  });
};

const showInfo = () => {
  info("Here is some information for you");
};

const showCustom = () => {
  showToast({
    type: "success",
    title: "Custom Toast",
    message: "This toast was created using showToast method",
    duration: 5000,
    closable: true,
  });
};

const clearAll = () => {
  clear();
};

// Form validation with toast
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const handleSubmit = () => {
  // Reset errors
  emailError.value = false;
  passwordError.value = false;

  let hasErrors = false;

  // Validate email
  if (!email.value) {
    error("Email is required");
    emailError.value = true;
    hasErrors = true;
  } else if (!validateEmail(email.value)) {
    error("Please enter a valid email address");
    emailError.value = true;
    hasErrors = true;
  }

  // Validate password
  if (!password.value) {
    error("Password is required");
    passwordError.value = true;
    hasErrors = true;
  } else if (!validatePassword(password.value)) {
    warning("Password must be at least 6 characters long");
    passwordError.value = true;
    hasErrors = true;
  }

  if (!hasErrors) {
    success("Form submitted successfully!", {
      title: "Success",
      duration: 3000,
    });
    // Reset form
    email.value = "";
    password.value = "";
  }
};

// API call simulation
const simulateApiCall = async () => {
  loading.value = true;

  try {
    info("Fetching data...", { duration: 1500 });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simulate random success/failure
    if (Math.random() > 0.3) {
      success("Data fetched successfully!", {
        title: "API Success",
        duration: 4000,
      });
    } else {
      throw new Error("Network timeout");
    }
  } catch (err) {
    error(`API Error: ${err.message}`, {
      title: "Request Failed",
      duration: 6000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.composable-example {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover:not(:disabled) {
  opacity: 0.8;
}

.btn.success {
  background: #10b981;
  color: white;
}
.btn.error {
  background: #ef4444;
  color: white;
}
.btn.warning {
  background: #f59e0b;
  color: white;
}
.btn.info {
  background: #3b82f6;
  color: white;
}
.btn.custom {
  background: #8b5cf6;
  color: white;
}
.btn.clear {
  background: #6b7280;
  color: white;
}
.btn.submit {
  background: #059669;
  color: white;
  width: 100%;
}
.btn.api {
  background: #06b6d4;
  color: white;
}

.form-example,
.api-example {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.form-input.error {
  border-color: #ef4444;
}

h3 {
  margin-bottom: 15px;
  color: #374151;
}
</style>
