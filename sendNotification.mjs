import axios from 'axios';

const TELEGRAM_SERVER_URL = 'https://privatepools-telegram-bot.vercel.app/send';

export const sendToTelegramServer = async (group, message) => {
  try {
    const response = await axios.post(TELEGRAM_SERVER_URL, {
      group,
      message
    });
    console.log('Message sent successfully:', { group, message });
    return response.data;
  } catch (error) {
    console.error('Error sending message to Telegram server:', error.response ? error.response.data : error.message);
    throw error;
  }
};

async function main() {
  try {
    await sendToTelegramServer("d3", "Tests passed successfully!");
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

main();
