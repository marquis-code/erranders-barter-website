<template>
  <div class="callback">
    <div class="card">
      <!-- Checking -->
      <div v-if="state === 'checking'" class="state">
        <div class="spinner" aria-hidden="true"></div>
        <h1>Confirming your payment</h1>
        <p class="lede">This takes a moment. Please do not close this page.</p>
        <p v-if="reference" class="ref">Reference {{ reference }}</p>
      </div>

      <!-- Paid -->
      <div v-else-if="state === 'paid'" class="state">
        <div class="tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1>Payment confirmed</h1>
        <p class="lede">
          Your money is held safely. The seller is told, and it is released when you both agree the
          handover is done.
        </p>
        <p v-if="amount" class="amount">₦{{ amount.toLocaleString() }}</p>
        <div class="actions">
          <NuxtLink :to="transactionId ? `/escrow?tx=${transactionId}` : '/escrow'" class="btn-primary">
            Track this order
          </NuxtLink>
          <NuxtLink to="/explore" class="btn-quiet">Keep browsing</NuxtLink>
        </div>
      </div>

      <!-- Already settled by the webhook -->
      <div v-else-if="state === 'already'" class="state">
        <div class="tick" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1>Already confirmed</h1>
        <p class="lede">This payment was confirmed earlier. Your money is still held safely in escrow.</p>
        <div class="actions">
          <NuxtLink :to="transactionId ? `/escrow?tx=${transactionId}` : '/escrow'" class="btn-primary">
            Track this order
          </NuxtLink>
        </div>
      </div>

      <!-- Failed -->
      <div v-else class="state">
        <div class="cross" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </div>
        <h1>We could not confirm that payment</h1>
        <p class="lede">{{ message }}</p>
        <p v-if="reference" class="ref">Reference {{ reference }}</p>
        <div class="actions">
          <NuxtLink to="/escrow" class="btn-primary">Open my escrow</NuxtLink>
          <NuxtLink to="/help" class="btn-quiet">Get help</NuxtLink>
        </div>
        <p class="note">
          If your bank shows the money left your account, do not pay again. Send us the reference above and
          we will settle it by hand.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { escrowApi } from '@/api_factory/modules/escrow';

/**
 * Where Paystack returns after a card payment.
 *
 * The reference is verified with the backend before anything is called paid: a browser can arrive here by
 * typing the URL, so the page reports what Paystack says, not what the query string claims.
 */
definePageMeta({ layout: 'default' });
useHead({ title: 'Payment status - Decluttered' });

const route = useRoute();
const state = ref<'checking' | 'paid' | 'already' | 'failed'>('checking');
const message = ref('');
const amount = ref(0);
const transactionId = ref('');
const reference = ref('');

const run = async () => {
  // Paystack sends `reference`, and `trxref` when the inline modal is used.
  const ref_ = String(route.query.reference || route.query.trxref || '').trim();
  reference.value = ref_;

  if (!ref_) {
    state.value = 'failed';
    message.value = 'The link is missing its payment reference.';
    return;
  }

  try {
    const res: any = await escrowApi.verifyCallback(ref_);
    const data = res?.data || res || {};
    transactionId.value = data.transactionId || '';
    amount.value = Number(data.amount || 0);
    state.value = data.alreadySettled ? 'already' : 'paid';
  } catch (e: any) {
    state.value = 'failed';
    message.value =
      e?.response?.data?.message ||
      'Paystack has not confirmed this payment yet. If you were charged, it will settle shortly.';
  }
};

onMounted(run);
</script>

<style scoped>
.callback {
  min-height: 78vh;
  display: grid;
  place-items: center;
  padding: 120px 20px 72px;
  background: #f7f4ef;
}

.card {
  width: 100%;
  max-width: 520px;
  padding: 36px 28px;
  border-radius: 20px;
  border: 1px solid #e7e2da;
  background: #fff;
  box-shadow: 0 18px 44px rgba(20, 17, 13, 0.08);
  text-align: center;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

h1 {
  margin: 6px 0 0;
  font-size: 23px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #14110d;
}

.lede {
  margin: 0;
  max-width: 42ch;
  font-size: 15px;
  line-height: 1.55;
  color: #6d675f;
}

.ref {
  margin: 4px 0 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #948d84;
}

.amount {
  margin: 4px 0 0;
  font-size: 30px;
  font-weight: 800;
  color: #14110d;
}

.tick,
.cross {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 999px;
}

.tick {
  background: #dcfce7;
  color: #15803d;
}

.cross {
  background: #fee2e2;
  color: #b91c1c;
}

.tick svg,
.cross svg {
  width: 30px;
  height: 30px;
}

.spinner {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 3px solid #f0ece5;
  border-top-color: #f2683a;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 18px;
}

.btn-primary,
.btn-quiet {
  padding: 12px 18px;
  border-radius: 11px;
  font-size: 15px;
  font-weight: 750;
  text-decoration: none;
}

.btn-primary {
  background: #f2683a;
  color: #fff;
}

.btn-primary:hover {
  background: #e2571f;
}

.btn-quiet {
  border: 1px solid #e3ded6;
  background: #fff;
  color: #14110d;
}

.note {
  margin: 16px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: #948d84;
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 3s;
  }
}
</style>
