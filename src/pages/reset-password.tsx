import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import PageLayout from "../components/PageLayout";
import { api } from "../utils/api";

const ResetPasswordPage: NextPage = () => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const router = useRouter();
  const resetPasswordMutation = api.admin.resetPassword.useMutation({
    async onSuccess() {
      await router.push('/');
    },
  });

  async function submitForm(e: FormEvent) {
    e.preventDefault();
    if (isPasswordValid()) {
      await resetPasswordMutation.mutateAsync({ newPassword: password });
    } // otherwise do nothing.
  }

  function isPasswordValid(): boolean {
    if (password === '' || passwordConfirm === '') return false;
    if (password !== passwordConfirm) return false;
    if (password.length < 8 || passwordConfirm.length < 8) return false;
    return true;
  }

  return (
    <>
      <Head>
        <title>Sundial - Reset Password</title>
        <meta name="theme-color" content="#bae6fd" />
      </Head>
      <PageLayout>
        <form 
          className="flex flex-col flex-grow p-4 gap-4 justify-center"
          onSubmit={submitForm}
        >
          <h2 className="text-2xl text-center">
            Reset Password
          </h2>
          <p className="font-bold text-center">
            Your password must have at least 8 characters.
          </p>
          <input
            className="input"
            value={password}
            onChange={(e: ChangeEvent) =>
              void setPassword((e.target as HTMLInputElement).value)}
            type="password"
            name="password"
            placeholder="Password"
          />
          <input
            className="input"
            value={passwordConfirm}
            onChange={(e: ChangeEvent) =>
              void setPasswordConfirm((e.target as HTMLInputElement).value)}
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
          />
          <button 
            type="submit"
            className="btn-primary"
            disabled={!isPasswordValid()}
          >
            Update Password
          </button>
        </form>
      </PageLayout>
    </>
  );
};

export default ResetPasswordPage;
