const contactForm = document.querySelector("#contato-formulario");
const contactStatus = document.querySelector("#contato-status");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const whatsappNumber = contactForm.dataset.whatsappNumber.replace(/\D/g, "");
  const formData = new FormData(contactForm);
  const message = [
    `Olá! Meu nome é ${formData.get("nome")}.`,
    `Meu e-mail: ${formData.get("email")}.`,
    `Meu telefone: ${formData.get("telefone")}.`,
    `Tenho interesse em: ${formData.get("servico")}.`,
    formData.get("mensagem") ? `Mensagem: ${formData.get("mensagem")}` : "",
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  const whatsappWindow = window.open(whatsappUrl, "_blank");

  if (whatsappWindow) {
    whatsappWindow.opener = null;
    contactStatus.textContent = "Mensagem preparada. Finalize o envio na conversa que abriu no WhatsApp.";
  } else {
    contactStatus.textContent = "O navegador bloqueou a nova janela. Permita pop-ups para continuar pelo WhatsApp.";
  }
});
