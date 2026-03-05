import csv
from models.room import Room


def load_rooms_from_csv(csv_path, profile="generous"):

    rooms = []

    with open(csv_path, newline="") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:

            min_area = float(row["Minimum Area"])
            target_area = float(row["Target Area"])

            # decide program size
            if profile == "compact":
                computed_area = min_area
            elif profile == "balanced":
                computed_area = (min_area + target_area) / 2.0
            else:  # generous
                computed_area = target_area

            # create room (Room class only accepts target_area)
            room = Room(
                name=row["Name"],
                room_type=row["Type"],
                category=row["Category"],
                target_area=computed_area,
                min_area=min_area
            )

            # store original values as attributes
            room.minimum_area = min_area
            room.original_target_area = target_area

            rooms.append(room)

    return rooms