import React, { ChangeEvent, useEffect, useState } from 'react';
import { DescriptionPosition, IDescription } from './Ad';
import { useCampaign } from '../../store/context';


interface IDescriptionProps {
    groupIndex: number,
    adIndex: number,
    index: number,
}


function Descrition({ groupIndex, adIndex, index }: IDescriptionProps) {

    const { campaign, setCampaign } = useCampaign();
    const description = campaign.groups[groupIndex].ads[adIndex].descriptions[index];

    const maxLength: number = 90;

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

    const removeDescription = () => {
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
                                        descriptions: a.descriptions.filter((d) => d.id !== a.descriptions[index].id),
                                    }
                                  : a
                          ),
                      }
                    : g
            ),
        }));
    };

    return (
        <div className="desc">
            Описание {index + 1}
            <div className="input-limit" style={{color: description.description.length >= maxLength ? "red": ""}}>{description.description.length}</div>
            <div className="desc-positions">
                <label className={`title-position ${description.position === 0 ? 'active' : ''}`} >
                    -
                    <input type="checkbox" name={`group-${groupIndex}-ad-${adIndex}-desc-postion-${index}`} value="0" onChange={(e: ChangeEvent<HTMLInputElement>) => {updateDescriptionField("position", 0)}} checked />
                </label>
                <label  className={`title-position ${description.position === 1 ? 'active' : ''}`}>
                    1
                    <input type="checkbox" name={`group-${groupIndex}-ad-${adIndex}-desc-postion-${index}`} value="1" onChange={(e: ChangeEvent<HTMLInputElement>) => {updateDescriptionField("position", 1)}} />
                </label>
                <label  className={`title-position ${description.position === 2 ? 'active' : ''}`}>
                    2
                    <input type="checkbox" name={`group-${groupIndex}-ad-${adIndex}-desc-postion-${index}`} value="2" onChange={(e: ChangeEvent<HTMLInputElement>) => {updateDescriptionField("position", 2)}} />
                </label>
            </div>
            <input type="text" name={`group-${groupIndex}-ad-${adIndex}-desc-${index}`} maxLength={maxLength}  className="title-input" value={description.description} onChange={(e: ChangeEvent<HTMLInputElement>) => {updateDescriptionField("description", e.target.value)}} required={index > 1 ? false : true} />
            <button style={{display: index < 2 ? "none" : ""}} onClick={removeDescription}>Удалить</button>
        </div>
    );
  }
  
export default Descrition;
  