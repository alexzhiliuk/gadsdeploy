import React, { ChangeEvent, useEffect, useState } from 'react';
import { ITitle, TitlePosition } from './Ad';
import { useCampaign } from '../../store/context';


interface ITitleProps {
    groupIndex: number,
    adIndex: number,
    index: number,
}


function Title({ groupIndex, adIndex, index }: ITitleProps) {

    const { campaign, setCampaign } = useCampaign();
    const title = campaign.groups[groupIndex].ads[adIndex].titles[index];

    const maxLength = 30;


    const updateTitleField = <K extends keyof ITitle>(field: K, value: ITitle[K]) => {
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
                                        titles: a.titles.map((t, k) =>
                                            k === index
                                                ? { ...t, [field]: value }
                                                : t
                                        ),
                                    }
                                  : a
                          ),
                      }
                    : g
            ),
        }));
    };

    const removeTitle = () => {
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
                                        titles: a.titles.filter((t) => t.id !== a.titles[index].id),
                                    }
                                  : a
                          ),
                      }
                    : g
            ),
        }));
    };

    return (
        <div className="title">
            Заголовок {index + 1}
            <div className="input-limit" style={{color: title.title.length >= maxLength ? "red": ""}}>{title.title.length}</div>
            <div className="title-positions">
                <label className={`title-position ${title.position === 0 ? 'active' : ''}`} >
                    -
                    <input type="checkbox" name={`group-${groupIndex}-ad-${adIndex}-title-postion-${index}`} value="0" onChange={(e: ChangeEvent<HTMLInputElement>) => {updateTitleField("position", 0)}} checked />
                </label>
                <label  className={`title-position ${title.position === 1 ? 'active' : ''}`}>
                    1
                    <input type="checkbox" name={`group-${groupIndex}-ad-${adIndex}-title-postion-${index}`} value="1" onChange={(e: ChangeEvent<HTMLInputElement>) => {updateTitleField("position", 1)}} />
                </label>
                <label  className={`title-position ${title.position === 2 ? 'active' : ''}`}>
                    2
                    <input type="checkbox" name={`group-${groupIndex}-ad-${adIndex}-title-postion-${index}`} value="2" onChange={(e: ChangeEvent<HTMLInputElement>) => {updateTitleField("position", 2)}} />
                </label>
                <label  className={`title-position ${title.position === 3 ? 'active' : ''}`}>
                    3
                    <input type="checkbox" name={`group-${groupIndex}-ad-${adIndex}-title-postion-${index}`} value="3" onChange={(e: ChangeEvent<HTMLInputElement>) => {updateTitleField("position", 3)}} />
                </label>
            </div>
            <input type="text" name={`group-${groupIndex}-ad-${adIndex}-title-${index}`} maxLength={maxLength}  className="title-input" value={title.title} onChange={(e: ChangeEvent<HTMLInputElement>) => {updateTitleField("title", e.target.value)}} 
                required={(index > 2 && campaign.type === "Google") || (index > 0 && campaign.type === "Yandex")  ? false : true} />
            <button style={{display: index < 3 ? "none" : ""}} onClick={removeTitle}>Удалить</button>
        </div>
    );
  }
  
export default Title;
  