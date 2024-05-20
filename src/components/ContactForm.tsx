import { useRef, useState } from 'react';
import { contactFormValidator, getZodErrors } from '../utils/formdata';

type Message = {
    type: 'success' | 'error';
    text: string;
};

export default function ContactForm() {
    const [message, setMessage] = useState<Message | null>(null);
    const [errors, setErrors] = useState<any>({});
    const [honey, setHoney] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const formRef = useRef<any>(undefined);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setMessage(null);
        setLoading(true);

        if (honey.length) return;

        const formValues = new FormData(formRef.current);
        const validValues = contactFormValidator.safeParse(
            Object.fromEntries(formValues.entries())
        );

        if (validValues.success === false) {
            const validationErrors = getZodErrors(validValues.error.formErrors.fieldErrors);
            setErrors(validationErrors);

            return setLoading(false);
        }

        fetch('/api/contact-form', {
            method: 'POST',
            body: JSON.stringify(validValues.data),
        })
            .then(res => res.json())
            .then(res => {
                if (res.success == false) {
                    setMessage({ type: 'error', text: res.message });
                } else {
                    // @ts-expect-error Form reset works
                    e.target.reset();
                    setMessage({ type: 'success', text: 'Message sent. Thank you!' });
                }
            })
            .catch(err => setMessage({ type: 'error', text: err.message }))
            .finally(() => setLoading(false));
    };

    return (
        <form className='contact-form' ref={formRef} onSubmit={handleSubmit}>
            {Object.values(errors).length || message ? (
                <p className={`message ${message?.type == 'success' ? 'success' : 'error'}`}>
                    {message?.text || 'Validation errors. Please try again'}
                </p>
            ) : (
                ''
            )}
            <div className='form-group'>
                <input type='text' name='first_name' id='first_name' disabled={loading} />
                <label htmlFor='first_name'>First Name</label>
                {errors.first_name?.length && (
                    <span className='field-error-text'>{errors?.first_name}</span>
                )}
            </div>
            <div className='form-group'>
                <input type='text' name='last_name' id='last_name' disabled={loading} />
                <label htmlFor='last_name'>Last Name</label>
                {errors.last_name?.length && (
                    <span className='field-error-text'>{errors?.last_name}</span>
                )}
            </div>
            <div className='form-group'>
                <input type='email' name='email' id='email' disabled={loading} />
                <label htmlFor='email'>Email Address</label>
                {errors.email?.length && <span className='field-error-text'>{errors?.email}</span>}
            </div>
            <div className='form-group'>
                <input
                    type='tel'
                    name='phone'
                    id='phone'
                    placeholder='xxx-xxx-xxxx'
                    disabled={loading}
                />
                <label htmlFor='email'>Phone</label>
            </div>
            <div className='form-group'>
                <textarea name='message' id='message' rows={4} disabled={loading}></textarea>
                <label htmlFor='message'>Message</label>
                {errors.message?.length && (
                    <span className='field-error-text'>{errors?.message}</span>
                )}
            </div>
            <div className='honey'>
                <input
                    type='text'
                    name='name__verify'
                    id='honey'
                    value={honey}
                    onChange={e => setHoney(e.target.value)}
                    tabIndex={-1}
                />
                <label htmlFor='honey'>Humans do not fill this one out!</label>
            </div>
            <button className='btn btn-secondary' disabled={loading}>
                {loading ? 'Loading...' : 'Send'}
            </button>
        </form>
    );
}
