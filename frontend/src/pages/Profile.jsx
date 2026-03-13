import styled from "styled-components";
import ProfileEditForm from "../features/authentication/ProfileEditForm.jsx";
import DeleteAccountSection from "../features/authentication/DeleteAccountSection.jsx";
import Heading from "../ui/Heading.jsx";

const PageStack = styled.div`
  display: grid;
  gap: 2.4rem;
`;

export default function Profile() {
  return (
    <PageStack>
      <Heading>Profile</Heading>
      <ProfileEditForm />
      <DeleteAccountSection />
    </PageStack>
  );
}
