import nodemailer from 'nodemailer'

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_EMAIL,
      pass: process.env.EMAIL_PASSPORT,
    },
  })

  let mailOptions = {
    from: 'adamadiouf2017@gmail.com',
    to: options.to, // Specify recipient(s) here
    subject: options.subject,
    text: options.message,
  }

  await transporter.sendMail(mailOptions)
}
export default sendEmail
