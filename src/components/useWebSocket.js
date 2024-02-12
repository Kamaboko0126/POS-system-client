import { ref, onMounted, onUnmounted } from 'vue';

export default function useWebSocket(url) {
  const socket = ref(null);
  const message = ref('');

  onMounted(() => {
    socket.value = new WebSocket(url);

    socket.value.addEventListener('message', (event) => {
      message.value = event.data;
    });
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.close();
    }
  });

  return { socket, message };
}