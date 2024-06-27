document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const captureButton = document.getElementById('capture-button');
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
          video.srcObject = stream;
      })
      .catch((err) => {
          console.error('Error accessing camera: ', err);
      });

  captureButton.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
          const formData = new FormData();
          formData.append('photo', blob, 'photo.png');

          fetch('/upload', {
              method: 'POST',
              body: formData
          })
          .then(response => response.json())
          .then(data => {
              console.log('Success:', data);
          })
          .catch((error) => {
              console.error('Error:', error);
          });
      });
  });
});
