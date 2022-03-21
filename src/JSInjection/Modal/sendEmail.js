import emailjs from '@emailjs/browser';
import{ init } from '@emailjs/browser';

init("d3k1rxdzrwjzQ3ro6");

export default function sendFeedbackEmail(feedback, url, articleId) {
	emailjs.send(
    "service_oi5bs2n","template_3l1o9ke",
  	{article_id: articleId,
    article_url: url,
    message: feedback
    }).then(res => {
    	console.log('Email successfully sent!')
  	})
}