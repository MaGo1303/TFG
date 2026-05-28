import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

export default function PaymentForm({ onFormValid }) {
    const [state, setState] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        focus: '',
    });

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formatted = value;

        if (name === 'number') {
            formatted = value.replace(/\D/g, '').slice(0, 16);
            formatted = formatted.replace(/(\d{4})(?=\d)/g, '$1 ');
        }
        if (name === 'expiry') {
            formatted = value.replace(/\D/g, '').slice(0, 4);
            if (formatted.length >= 3) {
                formatted = formatted.slice(0, 2) + '/' + formatted.slice(2);
            }
        }
        if (name === 'cvc') {
            formatted = value.replace(/\D/g, '').slice(0, 4);
        }

        const newState = { ...state, [name]: formatted };
        setState(newState);

        const newErrors = { ...errors };
        if (name === 'number' && formatted.replace(/\s/g, '').length < 16) {
            newErrors.number = 'Introduce 16 dígitos';
        } else {
            delete newErrors.number;
        }
        if (name === 'name' && formatted.trim().length < 3) {
            newErrors.name = 'Introduce el titular';
        } else {
            delete newErrors.name;
        }
        if (name === 'expiry' && formatted.length < 5) {
            newErrors.expiry = 'MM/AA';
        } else {
            delete newErrors.expiry;
        }
        if (name === 'cvc' && formatted.length < 3) {
            newErrors.cvc = 'CVC';
        } else {
            delete newErrors.cvc;
        }
        setErrors(newErrors);

        const isFormValid =
            newState.number.replace(/\s/g, '').length === 16 &&
            newState.name.trim().length >= 3 &&
            newState.expiry.length === 5 &&
            newState.cvc.length >= 3 &&
            Object.keys(newErrors).length === 0;

        onFormValid?.(isFormValid);
    };

    const handleInputFocus = (e) => {
        setState({ ...state, focus: e.target.name });
    };

    return (
        <div className="payment-form">
            <Cards
                number={state.number}
                expiry={state.expiry}
                cvc={state.cvc}
                name={state.name}
                focused={state.focus}
            />
            <div className="payment-form-fields">
                <div className="payment-field">
                    <label>Número de tarjeta</label>
                    <input
                        type="text"
                        name="number"
                        placeholder="0000 0000 0000 0000"
                        value={state.number}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className={errors.number ? 'error' : ''}
                    />
                </div>
                <div className="payment-field">
                    <label>Titular de la tarjeta</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="NOMBRE APELLIDOS"
                        value={state.name}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        className={errors.name ? 'error' : ''}
                    />
                </div>
                <div className="payment-field-row">
                    <div className="payment-field">
                        <label>Expiración</label>
                        <input
                            type="text"
                            name="expiry"
                            placeholder="MM/AA"
                            value={state.expiry}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            className={errors.expiry ? 'error' : ''}
                        />
                    </div>
                    <div className="payment-field">
                        <label>CVC</label>
                        <input
                            type="text"
                            name="cvc"
                            placeholder="123"
                            value={state.cvc}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            className={errors.cvc ? 'error' : ''}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
