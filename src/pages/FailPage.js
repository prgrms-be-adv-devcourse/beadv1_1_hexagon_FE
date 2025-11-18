import React from 'react';
import { useSearchParams } from 'react-router-dom';

export default function FailPage() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const message = searchParams.get("message");

    return (
        <div>
            <h1>결제 실패</h1>
            <p><b>실패 코드:</b> {code}</p>
            <p><b>실패 사유:</b> {message}</p>
        </div>
    );
}