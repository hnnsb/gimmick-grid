import QRCode from 'qrcode';

export const generateQRCodeDataUrl = async (text: string) => {
  try {
    return await QRCode.toDataURL(text, {width: 100});
  } catch (err) {
    console.error(err)
  }
};
