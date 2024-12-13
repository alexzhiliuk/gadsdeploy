from enum import Enum
from typing import List, Optional, Literal, Self
from exceptions import TooLongError, OverflowAdError


class CampaignType(Enum):
    GOOGLE = "GOOGLE"
    YANDEX = "YANDEX"


class KeywordType(Enum):
    """Типы ключевых слов для генерации ключей"""
    BROAD = "BROAD"
    PHRASE = "PHRASE"
    EXACT = "EXACT"


class Keyword:
    """Объект ключевых слов для генерации ключей"""

    def __init__(self, keyword: str, keyword_type: KeywordType):
        self.keyword = keyword
        self.type = keyword_type

    def __str__(self):
        if self.type == KeywordType.EXACT:
            return f"[{self.keyword}]"
        if self.type == KeywordType.PHRASE:
            return f"\"{self.keyword}\""
        if self.type == KeywordType.BROAD:
            return f"{self.keyword}"

    def __repr__(self):
        if self.type == KeywordType.EXACT:
            return f"<Keyword object {self.keyword} {self.type}>"
        if self.type == KeywordType.PHRASE:
            return f"<Keyword object {self.keyword} {self.type}>"
        if self.type == KeywordType.BROAD:
            return f"<Keyword object {self.keyword} {self.type}>"


class AdTitle:
    """Объект заголовка объявления"""

    def __init__(self, title: str, position: Optional[Literal[1] | Literal[2] | Literal[3]]):
        if len(title) > 15:
            raise TooLongError("Слишком длинный заголовок")

        self.title = title
        self.position = position

    @classmethod
    def get_titles_from_data(cls, data) -> List[Self]:
        """
        :param data: {
            position: int,
            title string
        }
        :return: AdTitle
        """
        titles = []

        for title_data in data:
            title_pos = int(title_data['position']) if title_data['position'] != "0" else None
            title = AdTitle(title_data["title"], title_pos)
            titles.append(title)

        return titles


class AdDesc:
    """Объект описания объявления"""

    def __init__(self, desc: str, position: Optional[Literal[1] | Literal[2] | Literal[3]]):
        if len(desc) > 90:
            raise TooLongError("Слишком длинное описание")

        self.desc = desc
        self.position = position

    @classmethod
    def get_descriptions_from_data(cls, data) -> List[Self]:
        """
        :param data: {
            position: int,
            description string
        }
        :return: AdDesc
        """
        descriptions = []

        for desc_data in data:
            desc_pos = int(desc_data['position']) if desc_data['position'] != "0" else None
            desc = AdDesc(desc_data["description"], desc_pos)
            descriptions.append(desc)

        return descriptions


class AdEndUrl:
    """Объект конечного URL объявления"""

    def __init__(self, end_url: str):
        self.end_url = end_url

    def __str__(self):
        return self.end_url


class AdPath:
    """Объект пути объявления"""

    def __init__(self, path: str):
        if len(path) > 15:
            raise TooLongError("Слишком длинный путь")

        self.path = path

    def __str__(self):
        return self.path


class AdTrackingUrl:
    """Объект шаблона отслеживания объявления"""

    def __init__(self, tracking_url: str):
        self.tracking_url = tracking_url

    def __str__(self):
        return self.tracking_url


class Ad:
    """Объект объявления группы рекламной компании"""

    def __init__(self, titles: List[AdTitle], descriptions: List[AdDesc], end_url: AdEndUrl,
                 paths: tuple[AdPath, AdPath], tracking_url: AdTrackingUrl):
        if len(titles) > 15 or len(descriptions) > 4:
            raise OverflowAdError("Слишком много заголовком или описаний")

        self.titles = titles
        self.descriptions = descriptions
        self.end_url = end_url
        self.paths = paths
        self.tracking_url = tracking_url

    @classmethod
    def get_ads_from_data(cls, data) -> List[Self]:
        """
        :param data: {
            titles: [],
            descriptions: [],
            endUrl: string,
            path1: string,
            path2: string,
            trackingTemplate: string,
        }
        :return: Ad
        """
        ads = []

        for ad_data in data:

            titles = AdTitle.get_titles_from_data(ad_data["titles"])
            descriptions = AdDesc.get_descriptions_from_data(ad_data["descriptions"])
            ad = Ad(titles, descriptions, AdEndUrl(ad_data["endUrl"]),
                    (AdPath(ad_data["path1"]), AdPath(ad_data["path2"])),
                    AdTrackingUrl(ad_data["trackingTemplate"]))
            ads.append(ad)

        return ads


class CampaignGroup:
    """Объект группы рекламной компании"""

    def __init__(self, name: str, keywords: str, ads: List[Ad]):
        self.name = name
        self.keywords = self._process_keywords(keywords)
        self.ads = ads

    @staticmethod
    def _process_keywords(keywords: str) -> List[Keyword]:
        keywords_list = []
        for keyword in keywords.split(","):
            keyword = keyword.strip()
            if keyword.startswith("[") and keyword.endswith("]"):
                keywords_list.append(Keyword(keyword[1:-1], KeywordType.EXACT))
                continue
            if keyword.startswith('"') and keyword.endswith('"'):
                keywords_list.append(Keyword(keyword[1:-1], KeywordType.PHRASE))
                continue
            keywords_list.append(Keyword(keyword, KeywordType.BROAD))

        return keywords_list

    def __str__(self):
        return self.name

    @classmethod
    def get_groups_from_data(cls, data) -> List[Self]:
        """
        :param data: {
            title: string,
            keywords: string,
            ads: []
        }
        :return: CampaignGroup
        """
        groups = []
        for group_data in data:
            group = CampaignGroup(group_data["title"], group_data["keywords"], Ad.get_ads_from_data(group_data["ads"]))
            groups.append(group)
        return groups


class Campaign:
    """Объект рекламной кампании"""

    def __init__(self, _type: CampaignType, name: str, groups: List[CampaignGroup]):
        self.type = _type
        self.name = name
        self.groups = groups

    @classmethod
    def get_campaign_from_data(cls, data: dict) -> Self:
        """
        :param data: {
            title: string,
            type: string,
            groups: []
        }
        :return: Campaign
        """
        campaign_type = None
        if data["type"] == "Yandex":
            campaign_type = CampaignType.YANDEX
        if data["type"] == "Google":
            campaign_type = CampaignType.GOOGLE

        return Campaign(campaign_type, data["title"], CampaignGroup.get_groups_from_data(data["groups"]))
