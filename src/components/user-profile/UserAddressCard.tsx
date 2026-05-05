"use client";

import React, { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  country: string | null;
  city_state: string | null;
  postal_code: string | null;
};

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [country, setCountry] = useState("");
  const [cityState, setCityState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("id, country, city_state, postal_code")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setCountry(data.country || "");
      setCityState(data.city_state || "");
      setPostalCode(data.postal_code || "");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!profile?.id) return;

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        country: country.trim(),
        city_state: cityState.trim(),
        postal_code: postalCode.trim(),
      })
      .eq("id", profile.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    await fetchProfile();
    window.dispatchEvent(new Event("profile-updated"));
    closeModal();
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profile?.country || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  City/State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profile?.city_state || "Not provided"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                  Postal Code
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {profile?.postal_code || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[560px] m-4">
        <div className="relative w-full rounded-3xl bg-white p-5 dark:bg-gray-900 lg:p-7">
          <div className="mb-5 pr-10">
            <h4 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Edit Address
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Update your address details.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <Label>Country</Label>
                <Input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div>
                <Label>City/State</Label>
                <Input
                  type="text"
                  value={cityState}
                  onChange={(e) => setCityState(e.target.value)}
                />
              </div>

              <div>
                <Label>Postal Code</Label>
                <Input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}