"use client";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { ReactNode } from "react";

import type { MenuCategory } from "./menu-data";

const currency = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
});

const formatPrice = (value: number | null) =>
  value === null ? "—" : currency.format(value);

const cellSx = {
  borderColor: "color-mix(in oklab, currentColor 12%, transparent)",
  color: "inherit",
  fontFamily: "inherit",
};

export function MenuTable({ category }: { category: MenuCategory }): ReactNode {
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        backgroundColor: "transparent",
        backgroundImage: "none",
        color: "inherit",
        border: "1px solid color-mix(in oklab, currentColor 10%, transparent)",
        borderRadius: "1.5rem",
      }}
    >
      <Table aria-label={category.title} size="medium">
        <TableHead>
          <TableRow>
            <TableCell sx={{ ...cellSx, fontWeight: 600 }}>Producto</TableCell>
            <TableCell align="right" sx={{ ...cellSx, fontWeight: 600 }}>
              Chico
            </TableCell>
            <TableCell align="right" sx={{ ...cellSx, fontWeight: 600 }}>
              Mediano
            </TableCell>
            <TableCell align="right" sx={{ ...cellSx, fontWeight: 600 }}>
              Grande
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {category.items.map((item) => (
            <TableRow key={item.name} sx={{ "&:last-child td": { border: 0 } }}>
              <TableCell component="th" scope="row" sx={cellSx}>
                <span className="block font-medium">{item.name}</span>
                {item.description ? (
                  <span className="block text-[13px] opacity-60">
                    {item.description}
                  </span>
                ) : null}
              </TableCell>
              <TableCell align="right" sx={cellSx}>
                {formatPrice(item.chico)}
              </TableCell>
              <TableCell align="right" sx={cellSx}>
                {formatPrice(item.mediano)}
              </TableCell>
              <TableCell align="right" sx={cellSx}>
                {formatPrice(item.grande)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
