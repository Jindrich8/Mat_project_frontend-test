import { FC } from "react"
import { ProfileFormCmp } from "../../components/ProfileFormCmp";
import { UpdatePasswordFormCmp } from "../../components/UpdatePasswordFormCmp";
import { Accordion, AccordionControl, AccordionItem, AccordionPanel } from "@mantine/core";

interface Props {

}

const ProfileInfo: FC<Props> = () => {

    return (<>
        <Accordion variant={'separated'} chevronPosition={'right'}>
            <AccordionItem value={'profileForm'}>
                <AccordionControl>Profil</AccordionControl>
                <AccordionPanel>
                    <ProfileFormCmp />
                </AccordionPanel>
            </AccordionItem>
            <AccordionItem value={'updatePasswordForm'}>
                <AccordionControl>Upravit heslo</AccordionControl>
                <AccordionPanel>
                    <UpdatePasswordFormCmp />
                </AccordionPanel>
            </AccordionItem>
        </Accordion>
    </>
    )
};

export { ProfileInfo, type Props as ProfileInfoProps };
