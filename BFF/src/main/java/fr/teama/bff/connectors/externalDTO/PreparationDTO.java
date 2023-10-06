package fr.teama.bff.connectors.externalDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

public class PreparationDTO {

    private UUID id;

    private LocalDateTime shouldBeReadyAt;

    private List<CookedItemDTO> preparedItems;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDateTime getShouldBeReadyAt() {
        return shouldBeReadyAt;
    }

    public void setShouldBeReadyAt(LocalDateTime shouldBeReadyAt) {
        this.shouldBeReadyAt = shouldBeReadyAt;
    }

    public List<CookedItemDTO> getPreparedItems() {
        return preparedItems;
    }

    public void setPreparedItems(List<CookedItemDTO> preparedItems) {
        this.preparedItems = preparedItems;
    }

    @Override
    public String toString() {
        return "PreparationDTO{" +
                "id=" + id +
                ", shouldBeReadyAt=" + shouldBeReadyAt +
                ", preparedItems=" + preparedItems +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PreparationDTO)) return false;
        PreparationDTO that = (PreparationDTO) o;
        return id.equals(that.id) && shouldBeReadyAt.equals(that.shouldBeReadyAt) && preparedItems.equals(that.preparedItems);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, shouldBeReadyAt, preparedItems);
    }
}
