import React, { createContext, useContext, useState, ReactNode } from "react";

import { IGroup } from "../components/Campaign/Campaign";
import { IDescription, ITitle } from "../components/Ad/Ad";

export type CampaignType = "Google" | "Yandex"

interface ICampaign {
    type: CampaignType,
    errorsCount: number,
    title: string;
    groups: IGroup[];
}

interface ICampaignContext {
    campaign: ICampaign;
    setCampaign: React.Dispatch<React.SetStateAction<ICampaign>>;
}

export function getDefaultTitles(type: CampaignType): ITitle[] {

    return Array.from({ length: type === "Google" ? 3 : 2 }, (_, index) => ({
        id: Date.now() + index,
        title: '',
        position: 0,
    }))
}

export function getDefaultDescriptions(type: CampaignType): IDescription[] {
    return Array.from({ length: type === "Google" ? 2 : 1 }, (_, index) => ({
        id: Date.now() + 100 + index,
        description: '',
        position: 0
    }))
}

const defaultType: CampaignType = "Google"

export const generateInitialCampaign = (type: CampaignType): ICampaign => ({
    type: type,
    errorsCount: 0,
    title: '',
    groups: [
        {
            id: Date.now(),
            title: "",
            keywords: "",
            ads: [
                {
                    id: Date.now(),
                    titles: getDefaultTitles(type),
                    descriptions: getDefaultDescriptions(type),
                    endUrl: "",
                    path1: "",
                    path2: "",
                    trackingTemplate: "",
                }
            ]
        }
    ],
})

export const inititalCampaign: ICampaign = generateInitialCampaign(defaultType)

const CampaignContext = createContext<ICampaignContext>({
    campaign: inititalCampaign,
    setCampaign: () => {},
});

export const CampaignProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [campaign, setCampaign] = useState<ICampaign>(inititalCampaign);

    return (
        <CampaignContext.Provider value={{ campaign, setCampaign }}>
            {children}
        </CampaignContext.Provider>
    );

};

export const useCampaign = () => useContext(CampaignContext);