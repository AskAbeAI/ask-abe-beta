
import PageFooter from "@/components/pageFooter"

export default function PrivacyPage() {
    return (
        <div className="h-auto w-screen bg-[#FCF8EE]">
            <div className="container max-width-lg bg-[#FCF8EE]">
                <div className="items-stretch bg-[#FCF8EE] flex flex-col justify-center px-24 py-12 max-md:px-5">
                    <header className="header justify-between mt-16 mb-10 max-md:max-w-full max-md:mr-1 max-md:mt-10">
                        <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                            <div className="flex flex-col items-stretch w-full max-md:w-full max-md:ml-0">
                                <div className="items-stretch flex grow flex-col pb-4 max-md:max-w-full max-md:mt-10">
                                    <h2 className="text-black text-5xl font-bold leading-[58px] max-md:max-w-full max-md:text-4xl max-md:leading-[54px]">
                                        Privacy Policy
                                    </h2>
                                    <div className="items-stretch flex justify-between gap-2 mt-2 max-md:max-w-full max-md:flex-wrap">
                                        <div className="bg-black flex w-0.5 shrink-0 h-[21px] flex-col" />
                                        <p className="text-black text-sm leading-5 font-bold grow shrink basis-auto max-md:max-w-full">
                                            Updated: December 8, 2023
                                        </p>
                                    </div>
                                    <p className="text-black text-base leading-6 mt-10 max-md:max-w-full">
                                    This privacy notice for Ask Abe, describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services").
                                    </p>

                                    <h4 className="text-black text-3xl font-bold leading-10 mt-6 pt-12 max-md:max-w-full">
                                        WHAT INFORMATION DO WE COLLECT?
                                    </h4>
                                    <h5 className="text-black text-2xl font-bold leading-9 mt-12 max-md:max-w-full max-md:mt-10">
                                        Personal information you disclouse to us
                                    </h5>
                                    <h5 className="text-black text-lg font-bold leading-9 mt-4 pr-10 max-md:max-w-full max-md:mt-10">
                                        Profile information
                                    </h5>
                                    <p className="text-black text-base leading-6 max-md:max-w-full">
                                        We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
                                    </p>
                                    <h5 className="text-black text-lg font-bold leading-9 mt-4 pr-10 max-md:max-w-full max-md:mt-10">
                                        User Content
                                    </h5>
                                    <p className="text-black text-base leading-6 max-md:max-w-full">
                                        When using our service, we collect all information that is included in any input fields, including any feedback you may provide. It is recommended that you do not under any circumstances reveal or include any personal information that is senesitive when interacting with our service. For development and improvements we record all data.
                                    </p>
                                    {/* <div className="items-stretch flex justify-between gap-2 mt-2 max-md:max-w-full max-md:flex-wrap">
                                <div className="bg-black flex w-0.5 shrink-0 h-[21px] flex-col" />
                                <p className="text-black text-sm leading-5 grow shrink basis-auto max-md:max-w-full">
                                    Image caption goes here
                                </p>
                            </div> */}
                                    <h5 className="text-black text-2xl font-bold leading-9 mt-16  max-md:max-w-full max-md:mt-10">
                                        Information automatically collected
                                    </h5>
                                    <h5 className="text-black text-lg font-bold leading-9 mt-4 max-md:max-w-full max-md:mt-10">
                                        Log & Usage Data
                                    </h5>
                                    <p className="text-black text-base leading-6 max-md:max-w-full">
                                        We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.
                                    </p>

                                    <h4 className="text-black text-3xl font-bold leading-10 mt-10 pt-10 max-md:max-w-full">
                                        HOW DO WE PROCESS YOUR INFORMATION?
                                    </h4>
                                    <p className="text-black text-base leading-6 mt-5 max-md:max-w-full">
                                        We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
                                    </p>
                                    <h4 className="text-black text-3xl font-bold leading-10 mt-10 pt-10 max-md:max-w-full">
                                        LINKS TO OTHER WEBSITES
                                    </h4>
                                    <p className="text-black text-base leading-6 mt-5 max-md:max-w-full">
                                        Our services may contain liks to other website that are not opperated or owned by Ask Abe. The information that you share with Third Party Sites will be goverened by those Third Party Sites privacy notices and terms of service. By providing these links we do not infer that we have reviewed these sites.
                                    </p>

                                    <h4 className="text-black text-3xl font-bold leading-10 mt-10 pt-10 max-md:max-w-full">
                                        SOCIAL LOGINS
                                    </h4>
                                    <p className="text-black text-base leading-6 mt-4 max-md:max-w-full">
                                        Our Services offer you the ability to register and log in using your third-party social media account details (like your Discord or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform.


                                        We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps.

                                    </p>

                                    <h4 className="text-black text-3xl font-bold leading-10 mt-10 pt-10 max-md:max-w-full">
                                        YOUR PRIVACY RIGHTS
                                    </h4>

                                    <p className="text-black text-base leading-6 mt-4 max-md:max-w-full">
                                        Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.


                                        However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent.

                                    </p>
                                    <h5 className="text-black text-lg font-bold leading-9 mt-10 pr-10 max-md:max-w-full max-md:mt-10">
                                        Account Information
                                    </h5>
                                    <p className="text-black text-base leading-6 mt-2 max-md:max-w-full">
                                        If you would at any time like to review or change the information in your account or terminate your account, you can:
                                        Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.

                                    </p>
                                    <h4 className="text-black text-3xl font-bold leading-10 mt-10 pt-10 max-md:max-w-full">
                                        HOW LONG DO WE KEEP YOUR INFORMATION?
                                    </h4>

                                    <p className="text-black text-base leading-6 mt-4 max-md:max-w-full">
                                        We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements).

                                    </p>
                                    <p className="text-black text-base leading-6 mt-5 max-md:max-w-full">
                                        When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
                                    </p>
                                    <h4 className="text-black text-3xl font-bold leading-10 mt-10 pt-10 max-md:max-w-full">
                                        CHILDREN
                                    </h4>

                                    <p className="text-black text-base leading-6 mt-4 max-md:max-w-full">
                                        We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent&apos;s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at
                                    </p>

                                    <h4 className="text-black text-3xl font-bold leading-10 mt-10 pt-10 max-md:max-w-full">
                                        CHANGES TO PRIVACY POLICY
                                    </h4>

                                    <p className="text-black text-base leading-6 mt-4 max-md:max-w-full">
                                        We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.

                                    </p>

                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
            <PageFooter/>
        </div>

    )

}