import React, { FC } from "react"
import { Resource } from "../Resource/ResourceTypes";
import { BasicProps } from "../../../types/props/props";
import { Stack, Title, TitleOrder } from "@mantine/core";

interface Props extends BasicProps {
    resources: Pick<Resource, 'renderCmp'>[],
    order:TitleOrder
}

const ResourcesCmp: FC<Props> = ({ resources,order }) => {
    return (
        <Stack gap={'xs'} align={'flex-start'}>
            {resources.map((resource, i) =>
                <Stack key={i}>
                    <Title order={order}>Zdroj {i + 1}</Title>
                    {resource.renderCmp({})}
                </Stack>
            )}
        </Stack>
    )
};

export { ResourcesCmp, type Props as ResourcesCmpProps };
