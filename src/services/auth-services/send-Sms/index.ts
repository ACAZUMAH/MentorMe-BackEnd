import createHttpError from "http-errors";

const sendSms = async (phone: string, message: string) => {
    const phoneFormat = phone.replace('+', '');
    const url = process.env.SMS_API_URL as string;
    const apiKey = process.env.SMS_API_KEY as string;
    const response = await fetch(url, 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "key": apiKey,
                "msisdn": `${phoneFormat}, 233xxxxxxxx`,
                "message": message,
                "sender_id": "findjobs",
            })
        }
    );
    if(!response.ok) {
        throw new createHttpError.BadGateway('Failed to send sms');
    }
    return true
};

export default sendSms;