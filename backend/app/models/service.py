from sqlalchemy import Boolean, Column, DateTime, Integer, Numeric, String, Text, func

from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, default="General")
    gender_category = Column(String(20), nullable=False, default="Unisex")
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=True)
    duration_minutes = Column(Integer, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    discount_percent = Column(Integer, nullable=False, default=0)
    offer_label = Column(String(100), nullable=True)
    has_offer = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    @property
    def discounted_price(self):
        """Price after applying the active offer, or the regular price."""
        if self.has_offer and self.discount_percent and self.discount_percent > 0 and self.price is not None:
            return round(float(self.price) * (1 - self.discount_percent / 100), 2)
        return float(self.price) if self.price is not None else None

    @property
    def final_price(self):
        return self.discounted_price
