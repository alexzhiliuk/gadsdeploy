import React, { ChangeEvent, useEffect, useState } from 'react';
import { getDefaultDescriptions, getDefaultTitles, useCampaign } from '../../store/context';
import Input from '../Inputs/Input';
import Ad, { IDescription, ITitle } from '../Ad/Ad';
import { IGroup } from '../Campaign/Campaign';
import YandexAd from '../Ad/YandexAd';


interface IGroupProps {
    index: number,
}

export interface IAd {
    id?: number,
    endUrl: string,
    path1: string,
    path2: string,
    trackingTemplate: string,
    titles: ITitle[]
    descriptions: IDescription[]
}


function Group({ index }: IGroupProps) {

    const { campaign, setCampaign } = useCampaign();
    const group = campaign.groups[index];

    const updateGroupTitle = (newTitle: string) => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === index ? { ...g, title: newTitle } : g
            ),
        }));
    };

    const updateGroupKeywords = (newKeywords: string) => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === index ? { ...g, keywords: newKeywords } : g
            ),
        }));
    };

    const addNewAdd = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === index
                    ? {
                          ...g,
                          ads: [
                              ...g.ads,
                              { 
                                id: Date.now(), 
                                endUrl: '', path1: '', path2: '', trackingTemplate: '', 
                                titles: getDefaultTitles(campaign.type),
                                descriptions: getDefaultDescriptions(campaign.type)
                            },
                          ],
                      }
                    : g
            ),
        }));
    };

    const removeGroup = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.filter((g) => g.id !== prev.groups[index].id)
        }));
    };

    return (
        <fieldset name={`group-${index}`} className="group">
            <Input label='Название группы' labelClass='group-name' inputName={`group-${index}-name`} required={true} value={group.title} onChangeCallback={updateGroupTitle} />
            
            <label className="group-keywords">
                <span style={{display: "inline-block", marginBottom: ".5em", fontWeight: "500"}}>Список ключевых слов*</span>
                Оформление соответствий:
                широкое соответствие - без оборачивания в спецсимволы
                "фразовое соответствие" - ключевое слово обернуто в двойные ковычки
                [точное соответствие] - ключевое слово обернуто в квадратные скобки
                <textarea 
                    name={`group-${index}-keywords`} 
                    value={group.keywords}
                    required={true}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {updateGroupKeywords(e.target.value)}}
                >
                </textarea>
            </label>

            <div className="ads">
                {group.ads.map((ad, i) => {
                    return campaign.type === "Google" ?  <Ad key={ad.id} groupIndex={index} index={i} /> : <YandexAd key={ad.id} groupIndex={index} index={i} />
                })}
            </div>
            <button type="button" className="add-ad" onClick={addNewAdd}>Создать новое объявление</button>
            <button type="button" className="remove-ad" style={{alignSelf: "flex-end", display: index == 0 ? "none": ""}} onClick={removeGroup}>Удалить группу</button>
        </fieldset>
        
    );
}
  
export default Group;
  