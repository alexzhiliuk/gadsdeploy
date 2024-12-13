import React, { ChangeEvent, useEffect, useState } from 'react';

import Input from '../Inputs/Input';
import { IAd } from '../Group/Group';
import Title from './Title';
import Descrition from './Description';
import { getDefaultDescriptions, getDefaultTitles, useCampaign } from '../../store/context';


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

function Ad({ groupIndex, index }: IAdProps) {

    const { campaign, setCampaign } = useCampaign();
    const ad = campaign.groups[groupIndex].ads[index];

    const maxPathLength: number = 15;


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
                
                {ad.titles.map((title, i) => (<Title groupIndex={groupIndex} adIndex={index} index={i} key={title.id} />))}
            </div>
            <button type="button" className="add-title" onClick={addNewTitle} style={{display: ad.titles.length > 14 ? "none": ""}}>+ Заголовок</button>

            <div className="descs">
                {ad.descriptions.map((description, i) => (<Descrition groupIndex={groupIndex} adIndex={index} index={i} key={description.id} />))}
            </div>
            <button type="button" className="add-desc" onClick={addNewDescription} style={{display: ad.descriptions.length > 3 ? "none": ""}}>+ Описание</button>

            <div className="url-params">
                <Input type='url' label='Конечный URL' labelStyles={{flexGrow: "1"}} inputName={`group-${groupIndex}-ad-${index}-end-url`} inputClass='end-url' required={true} value={ad.endUrl} fieldName='endUrl' onChangeCallback={(value, field) => {
                    if (field) updateAdField(value, field as keyof IAd);
                }} />
                <label>
                    Путь
                    <div className="url-params__row">
                        <input type="text" name={`group-${groupIndex}-ad-${index}-path-1`} maxLength={maxPathLength} className="path-1" required value={ad.path1} onChange={(e: ChangeEvent<HTMLInputElement>) => {updateAdField(e.target.value, "path1")}} />
                        <div className="input-limit" style={{color: ad.path1.length >= maxPathLength ? "red": ""}}>{ad.path1.length}</div>
                        /
                        <input type="text" name={`group-${groupIndex}-ad-${index}-path-2`} maxLength={maxPathLength} className="path-2" required value={ad.path2} onChange={(e: ChangeEvent<HTMLInputElement>) => {updateAdField(e.target.value, "path2")}} />
                        <div className="input-limit" style={{color: ad.path2.length >= maxPathLength ? "red": ""}}>{ad.path2.length}</div>
                    </div>
                </label>
            </div>
            <a href={ad.endUrl} style={{"display": ad.endUrl ? "" : "none"}} target='_blank'>Предпросмотр</a>
            <Input label='Шаблон отслеживания' inputName={`group-${groupIndex}-ad-${index}-tracking`} inputClass='tracking' required={false} value={ad.trackingTemplate} fieldName='trackingTemplate' onChangeCallback={(value, field) => {
                    if (field) value.startsWith("{lpurl}") ? updateAdField(value, field as keyof IAd) : updateAdField("{lpurl}" + value, field as keyof IAd);
                }} />
            
            <div className="ad-btns">
                <button type="button" className="duplicate-ad" onClick={duplicateAd}>Дублировать</button>
                <button type="button" className="clear-ad" style={{marginLeft: "auto", marginRight: index > 0 ? "20px": ""}} onClick={clearAdFields}>Очистить</button>
                <button type="button" className="remove-ad" onClick={removeAd} style={{display: index == 0 ? "none": ""}}>Удалить</button>
            </div>
            
        </fieldset>
    );
  }
  
export default Ad;
  