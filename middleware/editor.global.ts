import { getActivePinia } from "pinia";

function clearAllStore() {
  const activePinia = getActivePinia();
  if (!!activePinia) {
    // @ts-ignore
    activePinia._s.forEach(store => store.$reset());
  }
}

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.name === 'editor' && !to.query.storeMethod?.length) {
    return abortNavigation()
  }
  if (to.name === 'editor' || to.name === 'dashboard' || to.name === 'dashboard-my-projects') {
    clearAllStore();
  }
});