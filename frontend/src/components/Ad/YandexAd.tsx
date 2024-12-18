import React, { ChangeEvent, useEffect, useState } from 'react';

import Input from '../Inputs/Input';
import { IAd } from '../Group/Group';
import Title from './Title';
import Descrition from './Description';
import { getDefaultDescriptions, getDefaultTitles, useCampaign } from '../../store/context';
import YandexTitle from './YandexTitle';
import YandexDescrition from './YandexDescription';


interface IAdProps {
    groupIndex: number,
    index: number,
}

export type TitlePosition = 0 | 1 | 2 | 3

export interface ITitle {
    id?: number,
    title: string,
    position: TitlePosition
}

export type DescriptionPosition = 0 | 1 | 2

export interface IDescription {
    id?: number,
    description: string,
    position: DescriptionPosition
}

function YandexAd({ groupIndex, index }: IAdProps) {

    const { campaign, setCampaign } = useCampaign();
    const ad = campaign.groups[groupIndex].ads[index];

    const maxLengthEndUrl = 20;


    const updateAdField = <K extends keyof IAd>(value: IAd[K], field: K) => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                          ...g,
                          ads: g.ads.map((a, j) =>
                              j === index ? { ...a, [field]: value } : a
                          ),
                      }
                    : g
            ),
        }));
    };

    const updatePath = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\s+/g, "")
        updateAdField(value, "path1")
    }

    const addNewTitle = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                        ...g,
                        ads: g.ads.map((a, j) =>
                            j === index 
                                ? { 
                                    ...a, 
                                    titles: [
                                        ...a.titles, 
                                        {id: Date.now(), title: "", position: 0}
                                    ] 
                                } : a
                        ),
                      }
                    : g
            ),
        }));
    };
    const addNewDescription = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                        ...g,
                        ads: g.ads.map((a, j) =>
                            j === index 
                                ? { 
                                    ...a, 
                                    descriptions: [
                                        ...a.descriptions, 
                                        {id: Date.now(), description: "", position: 0}
                                    ] 
                                } : a
                        ),
                      }
                    : g
            ),
        }));
    };

    const clearAdFields = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                          ...g,
                          ads: g.ads.map((a, j) =>
                              j === index
                                  ? {
                                        ...a,
                                        endUrl: '',
                                        path1: '',
                                        path2: '',
                                        trackingTemplate: '',
                                        titles: getDefaultTitles(campaign.type),
                                        descriptions: getDefaultDescriptions(campaign.type),
                                    }
                                  : a
                          ),
                      }
                    : g
            ),
        }));
    };

    const duplicateAd = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                          ...g,
                          ads: [
                              ...g.ads,
                              {
                                  ...ad,
                                  id: Date.now(),
                                  titles: ad.titles.map((t) => ({
                                      ...t,
                                      id: Date.now() + Math.random(),
                                  })),
                                  descriptions: ad.descriptions.map((d) => ({
                                      ...d,
                                      id: Date.now() + Math.random() * 100,
                                  })),
                              },
                          ],
                      }
                    : g
            ),
        }));
    };

    const removeAd = () => {
        setCampaign((prev) => ({
            ...prev,
            groups: prev.groups.map((g, i) =>
                i === groupIndex
                    ? {
                          ...g,
                          ads: g.ads.filter((a) => a.id !== g.ads[index].id)
                      }
                    : g
            ),
        }));
    };
    
    

    return (
        <fieldset name={`group-${groupIndex}-ad-${index}`} className="group">
            <legend className="ad-title">Объявление {index + 1}</legend>

            <div className="titles">
                
                {ad.titles.map((title, i) => (<YandexTitle groupIndex={groupIndex} adIndex={index} index={i} key={title.id} />))}
            </div>
            <button type="button" className="add-title" onClick={addNewTitle} style={{display: ad.titles.length > 14 || campaign.type === "Yandex" ? "none": ""}}>+ Заголовок</button>

            <div className="descs">
                {ad.descriptions.map((description, i) => (<YandexDescrition groupIndex={groupIndex} adIndex={index} index={i} key={description.id} />))}
            </div>
            <button type="button" className="add-desc" onClick={addNewDescription} style={{display: ad.descriptions.length > 3 || campaign.type === "Yandex" ? "none": ""}}>+ Описание</button>

            <div className="url-params">
                <label style={{flexGrow: "1"}}>
                    <div style={{display: "flex", gap: "20px", alignItems: "center", marginBottom: "10px"}}>
                        Конечный URL
                        <div className="input-limit" style={{color: ad.endUrl.length >= maxLengthEndUrl ? "red": ""}}>{ad.endUrl.length}</div>
                    </div>
                    <input 
                        title="Это поле обязательно для заполнения"
                        type="url"
                        value={ad.endUrl}
                        name={`group-${groupIndex}-ad-${index}-end-url`} 
                        required={true} 
                        className="end-url"
                        maxLength={maxLengthEndUrl}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {updateAdField(e.target.value, "endUrl")}}
                    />
                </label>
                <label>
                    Отображаемая ссылка
                    <div className="url-params__row" style={{marginTop: "10px"}}>
                        <input type="text" name={`group-${groupIndex}-ad-${index}-path-1`} maxLength={20} className="path-1" required value={ad.path1} onChange={updatePath} />
                        <div className="input-limit" style={{color: ad.path1.length >= 20 ? "red": ""}}>{ad.path1.length}</div>
                    </div>
                </label>
            </div>
            <a href={ad.endUrl} style={{"display": ad.endUrl ? "" : "none"}} target='_blank'>Предпросмотр</a>
            
            <div className="ad-btns">
                <button type="button" className="duplicate-ad" onClick={duplicateAd}>Дублировать</button>
                <button type="button" className="clear-ad" style={{marginLeft: "auto", marginRight: index > 0 ? "20px": ""}} onClick={clearAdFields}>Очистить</button>
                <button type="button" className="remove-ad" onClick={removeAd} style={{display: index == 0 ? "none": ""}}>Удалить</button>
            </div>
            
        </fieldset>
    );
  }
  
export default YandexAd;
  