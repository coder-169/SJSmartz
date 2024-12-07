'use client';
import SectionLayout from '@/layouts/sectionLayout';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
function Forgot() {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: '',
    });
    const [resendLoading, setResendLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [createPassLoading, setCreatePassLoading] = useState(false);
    const [codeCorrect, setCodeCorrect] = useState(false);
    const handleEmailChange = async () => {
        setSent(false);
        setCodeCorrect(false);
    };
    const handlePasswords = async (e: { target: { value: string, id: string } }) => {
        const { id, value } = e.target;
        setPasswords({ ...passwords, [id]: value });
    };
    const router = useRouter();
    const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email === '') {
            setSent(false);
            setCodeCorrect(false);
            return toast.error('Email is required');
        }
        setResendLoading(true);
        try {
            const res = await fetch('/api/mail/forgot-pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('sjsmartz-forgot-code', data.hashedCode);
                localStorage.setItem('sjsmartz-forgot-expireTime', data.expireTime);
                toast.success(data.message);
                setSent(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred');
        }
        setResendLoading(false);
    };
    const handleSubmitCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            localStorage.getItem('sjsmartz-forgot-expireTime') && Number(localStorage.getItem('sjsmartz-forgot-expireTime')) < new Date().getTime()
        )
            return toast.error('Code expired!');
        if (code.length < 6) return toast.error('Code must contain 6 digits');
        try {
            setVerifyLoading(true);
            const res = await fetch('/api/auth/verify/code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hashedCode: localStorage.getItem('sjsmartz-forgot-code'),
                    code,
                }),
            });
            const data = await res.json();
            if (data.success) {
                setCodeCorrect(true);
                toast.success('Code verified! Create password');
            } else toast.error('incorrect code or expired!');
        } catch (error: any) {
            toast.error(error.message);
        }
        setVerifyLoading(false);
    };
    const handleSubmitPasswords = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passwords.password !== passwords.confirmPassword)
            return toast.error('Passwords do not match!');
        setCreatePassLoading(true);
        try {
            const res = await fetch('/api/auth/pass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, ...passwords }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success(data.message);
                router.push('/sign-in');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('An error occurred');
        }
        setCreatePassLoading(false);
    };
    // shift focus of input to next logic

    return (
        <SectionLayout>
            <div className="mb-16 mt-8 flex h-screen w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 ">
                {/* Sign in section */}

                {/* COde */}
                {sent && !codeCorrect ? (
                    <div className="mt-[4vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                        <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                            Verify Code
                        </h3>
                        <p className="mb-9 ml-1 text-base text-gray-600">
                            enter the code received on your email!
                        </p>
                        <form onSubmit={handleSubmitCode} data-hs-pin-input="">
                            <div className=" mb-12 flex space-x-3">
                                <input
                                    className={'text-center  w-full rounded-md  font-medium border border-[#6C7275] p-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]'}
                                    value={code}
                                    type="number"
                                    placeholder="⚬ ⚬ ⚬ ⚬ ⚬ ⚬ "
                                    id="d1"
                                    onChange={(e) => {
                                        if (e.target.value.length > 6) return;
                                        setCode(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="mb-4 flex items-center justify-between px-2">
                                <button
                                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmitEmail(e as any)}
                                    type="button"
                                    className="text-sm font-medium text-black transition-all duration-200 hover:text-black/70 disabled:cursor-progress disabled:opacity-60 dark:text-white dark:hover:text-gray-300"
                                    disabled={resendLoading}
                                >
                                    {resendLoading ? 'Resending...' : 'Resend code?'}
                                </button>
                                <button
                                    onClick={handleEmailChange}
                                    type="button"
                                    className="text-sm font-medium text-black transition-all duration-200 hover:text-black/70 dark:text-white dark:hover:text-gray-300"

                                >
                                    Correct Email?
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={verifyLoading}
                                className="flex  w-fit items-center gap-1 rounded-md bg-[#141718] px-6 py-3 font-inter text-sm font-medium text-white disabled:opacity-50"
                            >
                                {verifyLoading ? 'Verifying...' : 'Verify'}
                            </button>
                        </form>
                    </div>
                ) : (
                    !codeCorrect && (
                        <div className="mt-[4vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                                Enter Email
                            </h3>
                            <p className="mb-9 ml-1 text-base text-gray-600">
                                You will receive the code on the given email!
                            </p>
                            <form onSubmit={handleSubmitEmail} data-hs-pin-input="">
                                <div className=" mb-12 flex space-x-3">
                                    <input
                                        className="w-full rounded-md  font-medium border border-[#6C7275] p-4  text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                                        value={email}
                                        type="email"
                                        placeholder="johnboe@gmail.com"
                                        required={true}
                                        id="email"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={resendLoading}
                                    className="flex  w-fit items-center gap-1 rounded-md bg-[#141718] px-6 py-3 font-inter text-sm font-medium text-white disabled:opacity-50"
                                >
                                    {resendLoading ? 'Getting Code...' : ' Get Code'}
                                </button>
                            </form>
                        </div>
                    )
                )}
                {codeCorrect && (
                    <div className="mt-[4vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
                        <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
                            Create Password
                        </h3>
                        <p className="mb-9 ml-1 text-base text-gray-600">
                            Create a strong password! and both passwords should match
                        </p>{' '}
                        <form onSubmit={handleSubmitPasswords} data-hs-pin-input="">
                            <div className=" mb-12">
                                <label htmlFor="password">New Password</label>
                                <input
                                    className="w-full rounded-md  font-medium border border-[#6C7275] p-4 text-sm text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                                    value={passwords.password}
                                    type="text"
                                    placeholder="password"
                                    id="password"
                                    onChange={handlePasswords}
                                />
                            </div>
                            <div className=" mb-12">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    className="w-full rounded-md  font-medium border border-[#6C7275] p-4 text-sm  text-[#141718] outline-none transition-all  duration-200 placeholder:text-[#6C7275] placeholder:opacity-100 focus:border-[#141718]"
                                    value={passwords.confirmPassword}
                                    type="text"
                                    placeholder="confirm password"
                                    id="confirmPassword"
                                    onChange={handlePasswords}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={createPassLoading}
                                className="flex  w-fit items-center gap-1 rounded-md bg-[#141718] px-6 py-3 font-inter text-sm font-medium text-white disabled:opacity-50"
                            >
                                {createPassLoading ? 'Updating...' : 'Update'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </SectionLayout>

    );
}

export default Forgot;
