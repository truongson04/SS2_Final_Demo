import nodemailer from 'nodemailer';
export default async function sendEmail (email, subject, html){
    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'dangson2376@gmail.com',
            pass:'oyjp xumo thrr oydu'
        }
    });
    const mailOptions ={
        from:'dangson2376@gmail.com',
        to:email,
        subject:subject,
        html:html
    }
    try {
         const info = await transporter.sendMail(mailOptions);
         console.log('Email has been sent' + info )
    } catch (error) {
        console.log('Fail to sent email '+error)
    }
   
    
}