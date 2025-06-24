import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export const sendPasswordResetEmail = async (to: string, token: string) => {
  const resetLink = `http://localhost:8080/reset-password/${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Redefinição de Senha - Lord Motors',
    html: `
      <p>Você solicitou a redefinição da sua senha.</p>
      <p>Clique neste <a href="${resetLink}">link</a> para redefinir sua senha.</p>
      <p>Este link expirará em 5 minutos.</p>
      <p>Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail de redefinição de senha enviado para:', to);
  } catch (error) {
    console.error('Erro ao enviar e-mail de redefinição de senha:', error);
    throw new Error('Não foi possível enviar o e-mail de redefinição de senha.');
  }
};

export const sendWelcomeAndSetupPasswordEmail = async (to: string, token: string) => {
  const setupLink = `http://localhost:8080/reset-password/${token}`;

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: 'Bem-vindo à Lord Motors! Configure sua senha.',
    html: `
      <h1>Bem-vindo à Lord Motors!</h1>
      <p>Sua conta foi criada em nosso sistema.</p>
      <p>Por favor, clique neste <a href="${setupLink}">link</a> para configurar sua senha de acesso.</p>
      <p>Este link expirará em 24 horas.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail de configuração de senha enviado para:', to);
  } catch (error) {
    console.error('Erro ao enviar e-mail de configuração de senha:', error);
    throw new Error('Não foi possível enviar o e-mail de configuração de senha.');
  }
};
