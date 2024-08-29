
import { launch } from 'puppeteer-core';

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  // Inicia o navegador
  const browser = await launch({
    executablePath,
    headless: false, // Mantenha o navegador visível
  });


  const page = await browser.newPage();

  // Navega até o vídeo do YouTube
  await page.goto('https://www.youtube.com/watch?v=etAIpkdhU9Q');

  // Aguarda o player de vídeo carregar
  await page.waitForSelector('video');

  // Pressiona o botão play para iniciar o vídeo
  await page.evaluate(() => {
    const video = document.querySelector('video');
    console.log("teste");
    console.log(video);
    if (video) {
      video.play();
    }
  });

})();
