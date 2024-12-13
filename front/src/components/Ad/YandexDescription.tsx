import React, { ChangeEvent, useEffect, useState } from 'react';
import { DescriptionPosition, IDescription } from './Ad';
import { useCampaign } from '../../store/context';
import { extractPunctuation, extractSymbols, removePunctuation } from './YandexTitle';


interface IDescriptionProps {
    groupIndex: number,
    adIndex: number,
    index: number,
}


function YandexDescrition({ groupIndex, adIndex, index }: IDescriptionProps) {

    const { campaign, setCampaign } = useCampaign();
    const description = campaign.groups[groupIndex].ads[adIndex].descriptions[index];

    const maxLength: number = 81;

    const updateDescriptionField = <K extends keyof IDescription>(field: K, value: IDescription[K]) => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                          ...g,
                          ads: g.ads.map((a, j) =>
                              j === adIndex
                                  ? {
                                        ...a,
                                        descriptions: a.descriptions.map((d, k) =>
                                            k === index
                                                ? { ...d, [field]: value }
                                                : d
                                        ),
                                    }
                                  : a
                          ),
                      }
                    : g
            ),
        }));
    };

    const calculateLength = (description: string): number => {
        
        return description.length - extractSymbols(description).length
        
    }

    const changeDescription = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value,
            errorDelta = 0
        
        const errorEl = e.target.nextSibling as HTMLElement;
        errorEl.innerHTML = ""
        if (e.target.classList.contains("errorWord")) {
            errorDelta -= 1
        }
        if (e.target.classList.contains("errorLength")) {
            errorDelta -= 1
        }
        if (e.target.classList.contains("errorPunctuation")) {
            errorDelta -= 1
        }
        e.target.classList.remove("errorWord")
        e.target.classList.remove("errorLength")
        e.target.classList.remove("errorPunctuation")

        value.split(" ").forEach(word => {
            if (removePunctuation(word).length > 22) {
                e.target.classList.add("errorWord")
                errorEl.innerHTML = "В слове не должно быть больше 22 символов"
                errorDelta += 1
            }
        })
        if (value.length > maxLength) {
            e.target.classList.add("errorLength")
            errorDelta += 1
        }
        if (extractPunctuation(value).length - extractSymbols(value).length > 15) {
            e.target.classList.add("errorPunctuation")
            if (errorEl.innerHTML) errorEl.innerHTML += "<br/>"
            errorEl.innerHTML += "В заголовке не должно быть больше 15 знаков препинания"
            errorDelta += 1
        }
        
        setCampaign((prev) => ({
            ...prev,
            errorsCount: prev.errorsCount + errorDelta
        }))

        updateDescriptionField("description", value)
    }



    return (
        <div className="desc">
            Описание {index + 1}
            <div className="input-limit" style={{color: calculateLength(description.description) >= maxLength ? "red": ""}}>{calculateLength(description.description)}</div>
            <input type="text" name={`group-${groupIndex}-ad-${adIndex}-desc-${index}`} className="title-input" value={description.description} onChange={changeDescription} required={true} />
            <div className="error" style={{color: "red"}}></div>
        </div>
    );
  }
  
export default YandexDescrition;
  