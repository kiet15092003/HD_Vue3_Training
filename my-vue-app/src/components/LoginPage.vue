<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAlertStore } from "@/stores/Alert/alertStore.ts";
import { authService } from "@/services/Auth/authService";
import useVuelidate from "@vuelidate/core";
import {
  required,
  email,
  minLength,
  maxLength,
  helpers,
} from "@vuelidate/validators";
import Cookies from "js-cookie";

const emailValue = ref("");
const password = ref("");
const alertStore = useAlertStore();
const router = useRouter();

const rules = {
  email: { required, email },
  password: {
    required,
    minLength: minLength(6),
    maxLength: maxLength(16),
    regex: helpers.withMessage(
      "Password must contain at least one letter, one number, and one special character.",
      helpers.regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/
      )
    ),
  },
};

const v$ = useVuelidate(rules, { email: emailValue, password });

const login = async () => {
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) {
    alertStore.showAlert(
      "Invalid input",
      "error"
    );
    return;
  }

  try {
    const response = await authService.login({
      email: emailValue.value,
      password: password.value,
    });

    if (response.success && response.data) {
      alertStore.showAlert("Login successful!", "success");
      const userRole = Cookies.get("user_role");
      if (userRole === "Admin") {
        router.push("/admin/posts");
      } else {
        router.push("/");
      }
    } else {
      alertStore.showAlert(response.error[0], "error");
    }
  } catch (error) {
    alertStore.showAlert("An error occurred. Please try again.", "error");
  }
};
</script>

<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div class="input-group">
        <label>Email</label>
        <input 
            v-model="emailValue" 
            @blur="v$.email.$touch" 
            required
        />
        <span v-if="v$.email.$error" class="error-message">
          {{ v$.email.$errors[0].$message }}
        </span>
      </div>

      <div class="input-group">
        <label>Password</label>
        <input
          type="password"
          v-model="password"
          @blur="v$.password.$touch"
          required
        />
        <span v-if="v$.password.$error" class="error-message">
          {{ v$.password.$errors[0].$message }}
        </span>
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  width: 300px;
  margin: auto;
  padding: 20px;
  border-radius: 8px;
  background: #f9f9f9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: black;
}

.input-group {
  margin-bottom: 15px;
  text-align: left;
  padding-right: 17px;
}

label {
  display: block;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 4px;
}

</style>
