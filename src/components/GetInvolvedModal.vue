<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" role="presentation" @click.self="closeModal">
        <div class="modal-shell modal-shell--scrollable" role="dialog" aria-modal="true" aria-labelledby="get-involved-title">
          <button type="button" class="close-button" @click="closeModal" aria-label="Close get involved form">
            <span class="material-symbols-outlined" aria-hidden="true">close</span>
          </button>

          <div class="modal-grid">
            <aside class="modal-intro">

              <span class="eyebrow">Volunteer with us</span>
              <h2 id="get-involved-title">Join the Community Impact Network</h2>
              <p>
                Sign up to receive hands-on opportunities across food security, green infrastructure,
                education, and public health projects. We will match you with initiatives that align with your
                skills and availability.
              </p>

              <ul class="impact-points" aria-label="Ways you can make an impact">
                <li>
                  <span class="material-symbols-outlined" aria-hidden="true">diversity_3</span>
                  Mentorship, skills workshops, and outreach events
                </li>
                <li>
                  <span class="material-symbols-outlined" aria-hidden="true">volunteer_activism</span>
                  Support rapid response needs for urgent projects
                </li>
                <li>
                  <span class="material-symbols-outlined" aria-hidden="true">eco</span>
                  Help track and report the outcomes your effort creates
                </li>
              </ul>
            </aside>

            <form class="modal-form" @submit.prevent="handleSubmit">
              <fieldset class="form-group">
                <label for="vol-name">Full name</label>
                <input id="vol-name" v-model.trim="formData.name" type="text" name="name" autocomplete="name" placeholder="Taylor Morgan" required />
              </fieldset>

              <fieldset class="form-group">
                <label for="vol-email">Email</label>
                <input id="vol-email" v-model.trim="formData.email" type="email" name="email" autocomplete="email" placeholder="you@email.com" required />
              </fieldset>

              <fieldset class="form-group">
                <label for="vol-phone">Phone <span class="optional">Optional</span></label>
                <input
                  id="vol-phone"
                  v-model.trim="formData.phone"
                  type="tel"
                  name="phone"
                  autocomplete="tel"
                  inputmode="numeric"
                  pattern="[0-9]*"
                  placeholder="5551234567"
                  @input="onPhoneInput"
                />
              </fieldset>

              <fieldset class="form-group">
                <label for="vol-cause">Focus area</label>
                <select id="vol-cause" v-model="formData.cause" required>
                  <option value="" disabled>Select an area</option>
                  <option v-for="cause in causes" :key="cause" :value="cause">{{ cause }}</option>
                </select>
              </fieldset>

              <fieldset class="form-group">
                <label for="vol-location">Preferred location</label>
                <input id="vol-location" v-model.trim="formData.location" type="text" name="location" placeholder="City, State" required />
              </fieldset>

              <fieldset class="form-group">
                <legend>Availability</legend>
                <div class="checkbox-grid">
                  <label v-for="option in availabilityOptions" :key="option.value" class="checkbox-option">
                    <input
                      v-model="formData.availability"
                      type="checkbox"
                      name="availability"
                      :value="option.value"
                    />
                    <span class="custom-checkbox"></span>
                    {{ option.label }}
                  </label>
                </div>
              </fieldset>

              <fieldset class="form-group">
                <label for="vol-message">How can you help?</label>
                <textarea
                  id="vol-message"
                  v-model.trim="formData.message"
                  rows="4"
                  name="message"
                  placeholder="Share any relevant skills, interests, or availability details"
                  required
                ></textarea>
              </fieldset>

              <button class="submit-button" type="submit" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner" aria-hidden="true"></span>
                {{ isSubmitting ? 'Submitting' : 'Submit interest' }}
              </button>

              <p v-if="isSuccess" class="success-banner" role="status">
                <span class="material-symbols-outlined" aria-hidden="true">check_circle</span>
                Thanks! We'll be in touch within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'

import { useCommunityStore } from '@/stores/community'
import type { ProjectCause } from '@/stores/community'

const emit = defineEmits<{ (e: 'close'): void; (e: 'submitted'): void }>()

const store = useCommunityStore()
const { submitVolunteer } = store
const isOpen = defineModel<boolean>('isOpen', { required: true })

type AvailabilityType = 'weekdays' | 'weekends' | 'evenings'

interface FormData {
  name: string
  email: string
  phone: string
  cause: ProjectCause | ''
  location: string
  availability: AvailabilityType[]
  message: string
}

const causes: ProjectCause[] = ['Food', 'Environment', 'Education', 'Infrastructure', 'Health']

const availabilityOptions: { value: AvailabilityType; label: string }[] = [
  { value: 'weekdays', label: 'Weekdays' },
  { value: 'weekends', label: 'Weekends' },
  { value: 'evenings', label: 'Evenings' },
]

const defaultForm: FormData = {
  name: '',
  email: '',
  phone: '',
  cause: '',
  location: '',
  availability: [],
  message: '',
}

const formData = reactive<FormData>({ ...defaultForm })
const isSubmitting = ref(false)
const isSuccess = ref(false)

watch(
  () => isOpen.value,
  (open) => {
    if (!open) {
      setTimeout(() => {
        Object.assign(formData, defaultForm)
        isSuccess.value = false
      }, 250)
    }
  }
)

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const isFormValid = computed(() => {
  return (
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.cause !== '' &&
    formData.location.trim().length > 0 &&
    formData.availability.length > 0 &&
    formData.message.trim().length > 0
  )
})

const handleSubmit = async () => {
  if (!isFormValid.value || isSubmitting.value) return

  isSubmitting.value = true

  try {
    await submitVolunteer({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cause: formData.cause || 'Food',
      location: formData.location,
      availability: [...formData.availability],
      message: formData.message,
    })

    isSuccess.value = true
    emit('submitted')

    setTimeout(() => {
      closeModal()
    }, 2400)
  } catch (error) {
    console.error('Unable to submit volunteer interest', error)
  } finally {
    isSubmitting.value = false
  }
}

const onPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (!target) return
  const digitsOnly = target.value.replace(/[^0-9]/g, '')
  target.value = digitsOnly
  formData.phone = digitsOnly
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: var(--color-overlay);
  backdrop-filter: blur(12px);
  padding: clamp(1.5rem, 4vw, 3rem);
  z-index: 1400;
}

.modal-shell {
  position: relative;
  width: min(960px, 100%);
  border-radius: 24px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  max-height: min(92vh, 860px);
  margin: clamp(1rem, 4vh, 3rem) 0;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 999px;
  width: 42px;
  height: 42px;
  color: var(--color-text-secondary);
  display: grid;
  place-items: center;
  transition: background var(--transition-base), color var(--transition-base);
}

.close-button:hover,
.close-button:focus-visible {
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-primary);
}

.modal-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 3vw, 3rem);
  padding: clamp(2rem, 4vw, 3rem);
  overflow-y: auto;
  margin-top: 1.5rem;
  padding-top: clamp(2.5rem, 4vw, 3.5rem);
}

.modal-shell--scrollable .modal-grid {
  flex: 1;
}

.modal-intro {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  color: var(--color-text-secondary);
}

.modal-intro .eyebrow {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.modal-intro h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.2rem);
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  line-height: 1.2;
}

.impact-points {
  list-style: none;
  margin: 0;
  padding: 1rem 0 0;
  display: grid;
  gap: 0.75rem;
}

.impact-points li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
}

.impact-points .material-symbols-outlined {
  color: var(--color-primary);
  font-size: 1.35rem;
}

.modal-form {
  display: grid;
  gap: 1.25rem;
  background: var(--color-surface-alt);
  border: 1px solid var(--color-border);
  border-radius: 18px;
  padding: clamp(1.5rem, 3vw, 2rem);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label,
.form-group legend {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.95rem;
}

.form-group .optional {
  font-weight: 400;
  font-size: 0.82rem;
  color: var(--color-text-muted);
  margin-left: 0.25rem;
}

input,
select,
textarea {
  width: 100%;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(61, 181, 110, 0.25);
}

.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.checkbox-option {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color var(--transition-base), background var(--transition-base);
}

.checkbox-option input {
  position: absolute;
  opacity: 0;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  display: inline-block;
  background: transparent;
  transition: background var(--transition-base), border-color var(--transition-base);
}

.checkbox-option input:checked + .custom-checkbox {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.submit-button {
  margin-top: 1rem;
  justify-self: start;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 2.25rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 90%);
  color: #0b1510;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.submit-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 30px rgba(61, 181, 110, 0.35);
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(11, 21, 16, 0.2);
  border-top-color: rgba(11, 21, 16, 0.8);
  animation: spin 0.6s linear infinite;
}

.success-banner {
  margin: 0;
  border-radius: 14px;
  background: color-mix(in srgb, var(--color-primary) 18%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-primary) 35%, transparent);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-primary);
}

.success-banner .material-symbols-outlined {
  font-size: 1.2rem;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 860px) {
  .modal-grid {
    grid-template-columns: 1fr;
    margin-top: 0;
    padding-top: clamp(2rem, 4vw, 3rem);
  }

  .modal-intro {
    order: 1;
  }

  .modal-form {
    order: 2;
  }
}

@media (max-width: 560px) {
  .modal-shell {
    border-radius: 18px;
  }

  .close-button {
    top: 0.6rem;
    right: 0.6rem;
  }
}

:global(.theme-light) .modal-shell {
  box-shadow: var(--shadow-card);
}

:global(.theme-light) .modal-form {
  box-shadow: inset 0 1px 0 rgba(15, 26, 20, 0.06);
}

:global(.theme-light) .checkbox-option {
  background: var(--color-surface-alt);
}
</style>