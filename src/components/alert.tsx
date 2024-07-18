import React, { useState, forwardRef, useImperativeHandle, ForwardRefRenderFunction } from 'react';

interface AlertHandle {
    showAlert: (msg: string) => void;
}

export const Alert: ForwardRefRenderFunction<AlertHandle> = (_, ref) => {
    const [message, setMessage] = useState<string>('');
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        showAlert(msg: string) {
            setMessage(msg);
            setIsVisible(true);

            setTimeout(() => {
                closeAlert();
            }, 2000);
        }
    }));

    const closeAlert = () => {
        setIsVisible(false);
      };;

    return (
        <div className={`flex justify-center fixed bottom-4 left-1/2 transform -translate-x-1/2 transition duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'}`}>
            <div id="alert" className="flex justify-end w-60 h-12 alert bg-blue-900">
                <span>{message}</span>
                <button onClick={closeAlert} className="ml-auto btn btn-sm btn-circle btn-ghost">✕</button>
            </div>
        </div>
    );
};

export const AlertComponent = forwardRef<AlertHandle, {}>(Alert);

